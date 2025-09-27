// src/controllers/converterController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth'; // Importamos a interface para garantir que a rota está protegida
import { getRate } from '../services/currencyServices';

interface ConvertBody {
    amount: number;
    from: string;
    to: string;
}

export const convertCurrency = async (req: AuthRequest, res: Response) => {
    const { amount, from, to }: ConvertBody = req.body;

    // 1. Validação dos dados
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'O valor a ser convertido (amount) deve ser um número positivo.' });
    }
    if (!from || !to) {
        return res.status(400).json({ error: 'As moedas de origem (from) e destino (to) são obrigatórias.' });
    }

    if (from.toUpperCase() === to.toUpperCase()) {
        return res.status(200).json({ 
            from: from.toUpperCase(),
            to: to.toUpperCase(),
            amount: amount,
            convertedAmount: amount,
            rate: 1.0,
            message: `Conversão não necessária, moedas de origem e destino são iguais.`
        });
    }

    try {
        // 3. Buscar a cotação
        let rateObject = await getRate(from, to);
        
        // Caso a API não suporte a ordem FROM-TO (Ex: USD-BRL), tentamos TO-FROM (Ex: BRL-USD)
        let isInverse = false;
        if (!rateObject) {
            rateObject = await getRate(to, from);
            isInverse = true;
        }

        // 4. Se a cotação ainda não for encontrada
        if (!rateObject) {
            return res.status(404).json({ error: `Cotação não encontrada para os pares ${from}/${to} ou ${to}/${from}.` });
        }

        const rate = parseFloat(rateObject.bid);

        // 5. Calcular o valor convertido
        let convertedAmount: number;
        let finalRate: number;

        if (isInverse) {
            // Se encontramos BRL-USD, a taxa de conversão USD-BRL é 1 / (BRL-USD)
            finalRate = 1 / rate;
            convertedAmount = amount * finalRate;
        } else {
            // Conversão direta (Ex: amount * USD-BRL)
            finalRate = rate;
            convertedAmount = amount * finalRate;
        }

        // 6. Retornar o resultado
        return res.status(200).json({
            from: from.toUpperCase(),
            to: to.toUpperCase(),
            amount: amount,
            rate: finalRate.toFixed(6),
            convertedAmount: convertedAmount.toFixed(4), // Arredonda para 4 casas decimais
            convertedDate: new Date().toISOString()
        });

    } catch (error) {
        console.error('Erro no cálculo de conversão:', error);
        return res.status(500).json({ error: 'Erro interno ao processar a conversão.' });
    }
};