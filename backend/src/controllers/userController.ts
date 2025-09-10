import { Request, Response } from "express";
import { userService } from "../services/userService";

export const userController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const user = await userService.getUserById(Number(req.params.id));
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { name, email, password, role } = req.body;
      const newUser = await userService.createUser(name, email, password, role);
      return res.status(201).json(newUser);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const updatedUser = await userService.updateUser(Number(req.params.id), req.body);
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  },

  remove: async (req: Request, res: Response) => {
    try {
      const result = await userService.deleteUser(Number(req.params.id));
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
};
