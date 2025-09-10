import { Request, Response } from "express";
import { authService } from "../services/authService";

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const user = await authService.register(name, email, password);
      return res.status(201).json({ id: user.id, name: user.name, email: user.email });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { token } = await authService.login(email, password);
      return res.status(200).json({ token });
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }
};
