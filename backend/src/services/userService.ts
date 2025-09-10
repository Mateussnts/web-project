import { userRepository } from "../repository/userRepository";
import bcrypt from "bcryptjs";

export const userService = {
  getAllUsers: async () => {
    return await userRepository.findAll();
  },

  getUserById: async (id: number) => {
    const user = await userRepository.findById(id);
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  },

  createUser: async (name: string, email: string, password: string, role: string = "user") => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await userRepository.createUser(name, email, hashedPassword, role);
  },

  updateUser: async (id: number, data: any) => {
    const updated = await userRepository.updateUser(id, data);
    if (!updated[0]) throw new Error("Usuário não encontrado para atualização");
    return await userRepository.findById(id);
  },

  deleteUser: async (id: number) => {
    const deleted = await userRepository.deleteUser(id);
    if (!deleted) throw new Error("Usuário não encontrado para exclusão");
    return { message: "Usuário excluído com sucesso" };
  }
};
