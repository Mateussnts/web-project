import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const generateToken = (id: number): string => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '1d', // Expira em 1 dia
  });
};

export const register = async (req: Request, res: Response): Promise<Response> => {
  const {name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, Email e senha são obrigatórios.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Usuário com este email já existe.' });
    }

    const newUser = await User.create({name, email, password });

    const token = generateToken(newUser.id);
    
    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro no servidor ao registrar usuário.' });
  }
};

// ------------------------------------
// 2. Lógica de LOGIN
// ------------------------------------
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    // 1. Busca o usuário
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 2. Compara a senha (usando o método do Model)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 3. Gera o token e retorna a resposta
    const token = generateToken(user.id);

    return res.status(200).json({
      id: user.id,
      email: user.email,
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro no servidor ao realizar login.' });
  }
};