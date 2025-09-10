// src/controllers/quoteController.ts
import { Request, Response } from "express";
import { quoteService } from "../services/quoteService";
import { ExternalServiceError, ValidationError } from "../utils/errors";

export const quoteController = {
  async getBySymbol(req: Request, res: Response) {
    try {
      const symbol = (req.query.symbol as string)?.toUpperCase();
      if (!symbol) return res.status(400).json({ message: "Parâmetro 'symbol' é obrigatório." });

      const persist = req.query.persist === "true";
      const quote = await quoteService.getQuote(symbol, persist);
      return res.status(200).json(quote);
    } catch (err: any) {
      if (err instanceof ValidationError) {
        return res.status(err.status).json({ message: err.message });
      }
      if (err instanceof ExternalServiceError) {
        return res.status(503).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro interno ao obter cotação." });
    }
  },

  async getLatest(req: Request, res: Response) {
    try {
      const symbols = (req.query.symbols as string)?.split(",").map(s => s.trim().toUpperCase());
      const persist = req.query.persist === "true";
      const quotes = await quoteService.getLatest(symbols, persist);
      return res.status(200).json(quotes);
    } catch (err: any) {
      if (err instanceof ExternalServiceError) {
        return res.status(503).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro interno ao obter cotações." });
    }
  },
};
