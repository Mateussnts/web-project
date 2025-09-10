
import { Router } from "express";
import { conversionController } from "../controllers/conversionController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/calculator", conversionController.convert); 

export default router;
