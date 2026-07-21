import { Router } from "express";
import {
  createAssignment,
  returnAssignment
} from "../controllers/assignment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

// PATCH /api/assignments/:id/return -> Demirbaş iade alma (Sadece ADMIN ve DEPO)
router.patch(
  "/:id/return",
  authMiddleware,
  roleMiddleware(["ADMIN", "DEPO"]),
  returnAssignment
);

// POST /api/assignments -> Yeni zimmet oluşturma (Sadece ADMIN ve DEPO)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "DEPO"]),
  createAssignment
);

export default router;