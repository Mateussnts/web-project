// src/config/externalApi.ts
export interface ExternalApiConfig {
  baseURL: string;
  apiKey?: string;
  timeoutMs: number;
  defaultSymbols: string[]; // ex.: ["USD-BRL","EUR-BRL","BTC-BRL"]
}

export const externalApiConfig: ExternalApiConfig = {
  baseURL: process.env.EXTERNAL_API_BASE_URL || "https://economia.awesomeapi.com.br/json/last/:moedas",
  apiKey: process.env.EXTERNAL_API_KEY, 
  timeoutMs: Number(process.env.EXTERNAL_API_TIMEOUT_MS || 5000),
  defaultSymbols: (process.env.DEFAULT_SYMBOLS || "USD-BRL,EUR-BRL").split(","),
};
