// src/controllers/conversionController.ts
import { Request, Response } from "express";
import { conversionService } from "../services/conversionService";

export const conversionController = {
  async convert(req: Request, res: Response) {
    try {
      const { from, to, amount } = req.query;

      if (!from || !to || !amount) {
        return res.status(400).json({ message: "Parâmetros 'from', 'to' e 'amount' são obrigatórios." });
      }

      const result = await conversionService.convert(
        String(from).toUpperCase(),
        String(to).toUpperCase(),
        Number(amount)
      );

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
};
