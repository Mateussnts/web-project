import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

router.use(authMiddleware);              // exige login em todas as rotas
router.use(roleMiddleware("admin"));     // exige papel admin

router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.remove);

export default router;
