import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Usuários",
      version: "1.0.0",
      description: "Documentação da API usando Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
