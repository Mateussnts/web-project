// src/repositories/quoteRepository.ts
import { Quote } from "../models/Quote";

export const quoteRepository = {
  save: async (symbol: string, price: number, providerAt?: Date) => {
    return Quote.create({ symbol, price, providerAt });
  },
  latestBySymbol: async (symbol: string) => {
    return Quote.findOne({
      where: { symbol },
      order: [["createdAt", "DESC"]],
    });
  },
};
