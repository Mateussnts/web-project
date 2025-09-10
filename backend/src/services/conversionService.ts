
import { quoteService } from "./quoteService";

export interface ConversionResult {
  from: string;
  to: string;
  originalValue: number;
  convertedValue: number;
  rate: number;
}

export const conversionService = {
  async convert(
    fromSymbol: string, 
    toSymbol: string, 
    amount: number
  ): Promise<ConversionResult> {
    if (amount <= 0) throw new Error("O valor a ser convertido deve ser maior que zero.");

    // Obter cotações atuais
    const fromQuote = await quoteService.getQuote(fromSymbol);
    const toQuote = await quoteService.getQuote(toSymbol);

    // Calcular taxa de conversão
    const rate = fromQuote.price / toQuote.price;

    return {
      from: fromSymbol,
      to: toSymbol,
      originalValue: amount,
      convertedValue: Number((amount * rate).toFixed(4)),
      rate: Number(rate.toFixed(4)),
    };
  },
};
