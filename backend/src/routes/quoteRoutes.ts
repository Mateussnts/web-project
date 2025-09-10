// src/routes/quoteRoutes.ts
import { Router } from "express";
import { quoteController } from "../controllers/quoteController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/cotation", quoteController.getBySymbol);      // GET /quotes?symbol=USD-BRL[&persist=true]
router.get("/latest", quoteController.getLatest);  // GET /quotes/latest[?symbols=USD-BRL,EUR-BRL][&persist=true]

export default router;
