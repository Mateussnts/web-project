import axios from "axios";

const API_URL = "https://economia.awesomeapi.com.br/json/last/:moedas"; // substitua pela API real
const API_KEY = "ac9edbc81fbe4c40195361e99c5640672477d4a20655dc982ec8a58f1c6f5efa"; // se a API exigir autenticação

export class CurrencyService {
  static async getQuotation(base: string, target: string) {
    try {
      const response = await axios.get(`${API_URL}?base=${base}&target=${target}`, {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
        },
      });

      // Aqui você pode retornar apenas o que precisa
      return {
        base: response.data.base,
        target: response.data.target,
        rate: response.data.rate,
        date: response.data.date,
      };
    } catch (error: any) {
      console.error("Erro ao buscar cotação:", error.message);
      throw new Error("Não foi possível obter a cotação");
    }
  }
}
