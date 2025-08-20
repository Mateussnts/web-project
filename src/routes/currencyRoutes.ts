import { Router } from "express";
import { CurrencyService } from "../services/currencyService";

const router = Router();

router.get("/", async (req, res) => {
  const { base, target } = req.query as { base: string; target: string };

  if (!base || !target) {
    return res.status(400).json({ error: "Parâmetros base e target são obrigatórios" });
  }

  try {
    const quotation = await CurrencyService.getQuotation(base, target);
    res.json(quotation);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
