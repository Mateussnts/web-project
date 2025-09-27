// src/models/User.ts (Atualizado)
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

// Interface para garantir a tipagem do objeto User
export interface UserAttributes {
  id?: number;
  name: string;      // <-- NOVO CAMPO
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Classe do Modelo User
class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public name!: string; // <-- NOVO CAMPO
  public email!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

// Inicialização e Definição das Colunas
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: { // <-- NOVO CAMPO
    type: DataTypes.STRING,
    allowNull: false, // Nome é obrigatório
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'users',
  hooks: {
    // ... (os hooks para hashear a senha permanecem os mesmos)
    beforeCreate: async (user: User) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user: User) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

export default User;