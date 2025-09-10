import request from "supertest";
import app from "../server";
import  sequelize  from "../src/config/database"; 
import { User } from "../src/models/User";

describe("Auth API", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("deve registrar um novo usuário", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Mateus",
        email: "mateus@example.com",
        password: "123456"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("mateus@example.com");
  });

  it("não deve registrar usuário com e-mail duplicado", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Mateus",
        email: "mateus@example.com", // já usado
        password: "123456"
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("deve fazer login com credenciais corretas", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "mateus@example.com",
        password: "123456"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("mateus@example.com");
  });

  it("não deve autenticar com senha incorreta", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "mateus@example.com",
        password: "senhaErrada"
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
