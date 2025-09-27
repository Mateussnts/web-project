// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import User from '../models/User'; // Importe o modelo User se precisar buscar o ID

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export interface AuthRequest extends Request {
  userId?: number;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

      req.userId = decoded.id;

      next();
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      return res.status(401).json({ error: 'Não autorizado, token inválido.' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Não autorizado, token não encontrado.' });
  }
};