// src/routes/dashboardRoutes.ts
import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/data', protect, getDashboardData);

export default router;