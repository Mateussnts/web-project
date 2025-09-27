export interface QuoteData {
  id: string; // Ex: USDBRL
  name: string; // Ex: Dólar Americano/Real Brasileiro
  currentBid: string; // Preço atual formatado
  dailyHigh: string; // Máxima do dia
  dailyLow: string; // Mínima do dia
  variation: number; // Variação absoluta
  pctChange: string; // Variação percentual formatada
  updateDate: string; // Data da cotação
  bid?: string;
}

export interface DashboardResponse {
  message: string;
  quotes: { [key: string]: QuoteData };
}

export interface CardQuote {
    pair: string; 
    value: string; 
    currencySymbol: string; 
}