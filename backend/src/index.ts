import express from "express";
import * as dotenv from "dotenv";
import  sequelize from "./config/database";
import userRoutes from "./routes/userRoutes";
import { setupSwagger } from "./swagger";
import currencyRoutes from "./routes/quoteRoutes";


dotenv.config();

const app = express();
app.use(express.json());

// Usar as rotas do usuário
app.use("/users", userRoutes);

// documentação swagger

setupSwagger(app);

app.use("/api/users", userRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
  console.log("Documentação Swagger em http://localhost:3000/docs");
});


app.use("/api/currency", currencyRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");

});
// Testando a conexão e inicializando o servidor
sequelize.sync({ force: false }).then(() => {
  console.log("Banco de dados conectado!");
  app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
}).catch((error) => {
  console.error("Erro ao conectar ao banco de dados:", error);
});
