import axios from 'axios';

export interface CurrencyRate {
    code: string;
    codein: string;
    bid: string; 
}

/**
 * Busca a cotação de um par de moedas (Ex: USD-BRL) na Awesome API.
 * @param fromCode Código da moeda de origem (Ex: USD)
 * @param toCode Código da moeda de destino (Ex: BRL)
 * @returns O objeto de cotação com o valor de 'bid'
 */
export const getRate = async (fromCode: string, toCode: string): Promise<CurrencyRate | null> => {
    const pair = `${fromCode}-${toCode}`;
    const url = `https://economia.awesomeapi.com.br/json/last/${pair}`;

    try {
        const response = await axios.get<any>(url);
        
        // Verifica se a API retornou a cotação
        if (response.data && response.data[pair]) {
            const rawRate = response.data[pair];
            return {
                code: rawRate.code,
                codein: rawRate.codein,
                bid: rawRate.bid 
            };
        }
        
        return null;

    } catch (error) {
        console.error(`Erro ao buscar cotação para ${pair}:`, error);
        return null; 
    }
};