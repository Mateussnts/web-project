// src/models/Quote.ts
import { DataTypes, Model, Optional } from "sequelize";
import  sequelize  from "../config/database";

interface QuoteAttributes {
  id: number;
  symbol: string;
  price: number;
  providerAt: Date;
}

interface QuoteCreationAttributes extends Optional<QuoteAttributes, "id" | "providerAt"> {}

export class Quote extends Model<QuoteAttributes, QuoteCreationAttributes>
  implements QuoteAttributes {
  public id!: number;
  public symbol!: string;
  public price!: number;
  public providerAt!: Date;
}

Quote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    providerAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Quote",
    tableName: "quotes",
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["symbol"], 
      },
    ],
  }
);
