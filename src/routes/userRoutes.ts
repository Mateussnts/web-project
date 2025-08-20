import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserService } from "../services/userService";
import { UserRepository } from "../repository/userRepository";
import { authenticateJWT } from "../middleware.ts/authMiddleware";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = Router();

router.post("/", (req, res, next) => {
    try {
        userController.createUser(req, res).catch(next);
    } catch (error: any) {
        res.status(500).json({ message: "Erro ao obter os usuários", error: error.message });
    }
});

router.post("/login", async (req, res) => {
  try {
    await userController.login(req, res);
  } catch (error: any) {
    res.status(401).json({ message: "Falha na autenticação", error: error.message });
  }
});

router.get("/", authenticateJWT, async (req, res) => {
    try {
        await userController.getUsers(req, res);
    } catch (error: any) {
        res.status(500).json({ message: "Erro ao obter os usuários", error: error.message });
    }
});


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get("/", (req, res) => {
  res.json([{ id: 1, name: "Mateus" }]);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado
 */
router.post("/", (req, res) => {
  res.status(201).json(req.body);
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", (req, res) => {
  // lógica de autenticação
  res.json({ token: "abc123" });
});

export default router;