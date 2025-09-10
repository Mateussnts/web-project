import request from "supertest";
import app from "../server"; 
import  sequelize  from "../src/config/database";
import { User } from "../src/models/User";

let adminToken: string;
let userId: number;

describe("User CRUD API", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // cria usuário admin para autenticar
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Admin",
        email: "admin@example.com",
        password: "123456",
        role: "admin", // se seu modelo permitir role
      });

    // login para pegar token
    const loginRes = await request(app)
      .post("/auth/login")
      .send({
        email: "admin@example.com",
        password: "123456",
      });

    adminToken = loginRes.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("deve criar um usuário", async () => {
    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Mateus",
        email: "mateus@example.com",
        password: "123456",
        role: "user",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    userId = res.body.id;
  });

  it("deve listar usuários", async () => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("deve buscar um usuário pelo ID", async () => {
    const res = await request(app)
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
    expect(res.body.email).toBe("mateus@example.com");
  });

  it("deve atualizar um usuário", async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Mateus Atualizado",
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Mateus Atualizado");
  });

  it("deve excluir um usuário", async () => {
    const res = await request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(204); // No Content
  });

  it("não deve acessar sem token JWT", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(401);
  });
});
