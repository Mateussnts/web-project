import { User } from "../models/User";


export class UserRepository {
    // Criar um novo usuário
  async createUser(userData: Partial<User>): Promise<User> {
    return User.create(userData);
  }

  // Buscar todos os usuários
  async getAllUsers(): Promise<User[]> {
    return User.findAll();
  }

  // Buscar um usuário por ID
  async findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  async findByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }
  
  // Deletar um usuário
  async delete(id: number): Promise<number> {
    return User.destroy({ where: { id } });
  }
}
