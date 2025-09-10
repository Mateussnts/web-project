import { User } from "../models/User";

export const userRepository = {
  findAll: async () => {
    return await User.findAll({ attributes: ["id", "name", "email", "role"] });
  },

  findByEmail: async (email: string) => {
    return await User.findOne({where: {email}})
  },

  findById: async (id: number) => {
    return await User.findByPk(id, { attributes: ["id", "name", "email", "role"] });
  },

  createUser: async (name: string, email: string, password: string, role: string = "user") => {
    return await User.create({ name, email, password, role });
  },

  updateUser: async (id: number, data: Partial<User>) => {
    return await User.update(data, { where: { id } });
  },

  deleteUser: async (id: number) => {
    return await User.destroy({ where: { id } });
  }
};
