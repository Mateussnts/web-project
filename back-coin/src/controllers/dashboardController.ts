import { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { AuthRequest } from '../middleware/auth'; // Importa a interface estendida

dotenv.config();

const CURRENCY_API_URL = process.env.CURRENCY_API_URL;

interface CurrencyQuote {
    code: string;
    codein: string;
    name: string;
    high: string;
    low: string;
    varBid: string;
    pctChange: string;
    bid: string;
    ask: string;
    timestamp: string;
    create_date: string;
}

interface ExternalApiResponse {
    [key: string]: CurrencyQuote;
}


export const getDashboardData = async (req: AuthRequest, res: Response) => {
    if (!CURRENCY_API_URL) {
      return res.status(500).json({ error: "URL da API de cotações não configurada." });
    }

    try {
        const { data: rawData } = await axios.get<ExternalApiResponse>(CURRENCY_API_URL);

        const formattedData: { [key: string]: any } = {};
        const currencyKeys = Object.keys(rawData);

        currencyKeys.forEach(key => {
            const item = rawData[key];
            
            const bidValue = parseFloat(item.bid);
            const varBidValue = parseFloat(item.varBid);
            const pctChangeValue = parseFloat(item.pctChange);

            formattedData[key] = {
                id: key,
                name: item.name,
                currentBid: bidValue.toFixed(4), // Cotação atual (bid)
                dailyHigh: item.high,
                dailyLow: item.low,
                variation: varBidValue, // Variação em valor absoluto
                pctChange: pctChangeValue.toFixed(2) + '%', // Variação em percentual
                updateDate: item.create_date,
            };
        });

        return res.status(200).json({
            message: `Dados do Dashboard para o usuário ${req.userId} (logado).`,
            quotes: formattedData
        });

    } catch (error) {
        console.error('Erro ao buscar dados da API de cotações:', error);
        return res.status(500).json({ error: 'Erro ao conectar com a API de cotações externa.' });
    }
};