import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repository/userRepository";
import { User } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "secreta";

export const authService = {
  register: async (name: string, email: string, password: string): Promise<User> => {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) throw new Error("E-mail já cadastrado");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.createUser(name, email, hashedPassword);
    return user;
  },

  login: async (email: string, password: string): Promise<{ token: string }> => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("Usuário não encontrado");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error("Senha inválida");

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token };
  }
};
