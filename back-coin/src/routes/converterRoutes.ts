// src/routes/converterRoutes.ts
import { Router } from 'express';
import { convertCurrency } from '../controllers/converterController';
import { protect } from '../middleware/auth'; 

const router = Router();

router.post('/conversion', protect, convertCurrency);

export default router;