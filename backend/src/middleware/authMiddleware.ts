import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secreta";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "Token não fornecido" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    (req as any).user = decoded; // adiciona user no request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
};
