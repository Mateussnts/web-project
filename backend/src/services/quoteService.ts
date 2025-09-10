// src/services/quoteService.ts
import { client } from "../utils/apiClient";
import { MemoryCache } from "../utils/cache";
import { ExternalServiceError, ValidationError } from "../utils/errors";
import { externalApiConfig } from "../config/externalAPI";
import { quoteRepository } from "../repository/quoteRepository"; // opcional

const cache = new MemoryCache(10_000); // 10s

export interface QuoteDTO {
  symbol: string; // "USD-BRL"
  price: number;  // 5.1234
  providerAt?: string; // ISO
}

function normalizePayload(symbol: string, payload: any): QuoteDTO | null {
  // Tenta chaves comuns: "USDBRL" ou "USD_BRL" a partir de "USD-BRL"
  const key1 = symbol.replace("-", "");   // USD-BRL -> USDBRL
  const key2 = symbol.replace("-", "_");  // USD-BRL -> USD_BRL

  const node = payload[key1] || payload[key2] || payload[symbol];
  if (!node) return null;

  // Tenta ler campo de preço mais comum: "ask" (string/number)
  const rawPrice = node.ask ?? node.price ?? node.bid ?? node.last;
  if (rawPrice == null) return null;

  const price = typeof rawPrice === "string" ? Number(rawPrice) : rawPrice;
  if (Number.isNaN(price)) return null;


  return { symbol, price};
}

export const quoteService = {
  async getQuote(symbol: string, persist = false): Promise<QuoteDTO> {
    // validação básica do símbolo: AAA-BBB (3-5 chars)
    if (!/^[A-Z]{3,5}-[A-Z]{3,5}$/.test(symbol)) {
      throw new ValidationError("Par de moedas inválido. Use o formato AAA-BBB (ex.: USD-BRL).");
    }

    // cache
    const cached = cache.get<QuoteDTO>(`q:${symbol}`);
    if (cached) return cached;

    try {
      // Exemplo com AwesomeAPI:
      // GET /last/USD-BRL -> { "USDBRL": { ask, create_date, ... } }
      const { data } = await client.get(`/last/${symbol}`);

      const normalized = normalizePayload(symbol, data);
      if (!normalized) throw new ExternalServiceError("Resposta do provedor em formato inesperado.");

      // cache
      cache.set(`q:${symbol}`, normalized);

      // persistência opcional
      if (persist) {
        const providerAtDate = normalized.providerAt ? new Date(normalized.providerAt) : undefined;
        await quoteRepository.save(normalized.symbol, normalized.price, providerAtDate);
      }

      return normalized;
    } catch (err: any) {
      // encapsula erro
      throw new ExternalServiceError(err?.message || "Falha ao consultar provedor de cotações.");
    }
  },

  async getLatest(symbols: string[] = externalApiConfig.defaultSymbols, persist = false): Promise<QuoteDTO[]> {
    const results: QuoteDTO[] = [];
    for (const s of symbols) {
      try {
        const q = await this.getQuote(s, persist);
        results.push(q);
      } catch {
        // falha isolada de um símbolo não deve derrubar a lista inteira
      }
    }
    if (results.length === 0) {
      throw new ExternalServiceError("Nenhuma cotação pôde ser obtida no momento.");
    }
    return results;
  },


};
