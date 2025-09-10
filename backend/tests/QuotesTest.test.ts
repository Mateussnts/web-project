// src/__tests__/quote.test.ts
import request from "supertest";
import app from "../server"; // seu app Express principal
import  sequelize  from "../src/config/database";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

let token: string;

describe("Quote API", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // cria usuário e pega token
    await request(app).post("/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });

    const loginRes = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "123456",
    });

    token = loginRes.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("deve retornar a cotação de uma moeda específica", async () => {
    // simula resposta da API externa
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        USD_BRL: { code: "USD", codein: "BRL", ask: "5.10" },
      },
    });

    const res = await request(app)
      .get("/quotes?symbol=USD-BRL")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("symbol", "USD-BRL");
    expect(res.body).toHaveProperty("price", 5.1);
  });

  it("deve retornar as últimas cotações de várias moedas", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        USD_BRL: { ask: "5.10" },
        EUR_BRL: { ask: "6.20" },
      },
    });

    const res = await request(app)
      .get("/quotes/latest")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("symbol");
    expect(res.body[0]).toHaveProperty("price");
  });

  it("não deve acessar sem token JWT", async () => {
    const res = await request(app).get("/quotes?symbol=USD-BRL");
    expect(res.status).toBe(401);
  });

  it("deve lidar com erro da API externa graciosamente", async () => {
    // simula falha da API externa
    mockedAxios.get.mockRejectedValueOnce(new Error("API indisponível"));

    const res = await request(app)
      .get("/quotes?symbol=USD-BRL")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(502); // ou 500, conforme definido no controller
    expect(res.body).toHaveProperty("error");
  });
});
