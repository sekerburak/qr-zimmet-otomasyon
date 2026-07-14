import { Router } from "express";

import authRoutes from "./auth.routes";
import assetRoutes from "./asset.routes";
import auditRoutes from "./audit.routes";
import assignmentRoutes from "./assignment.routes";
import qrRoutes from "./qr.routes";


const router = Router();
router.use("/qr", qrRoutes);
router.use("/auth", authRoutes);
router.use("/assets", assetRoutes);
router.use("/audit-logs", auditRoutes);
router.use("/assignments", assignmentRoutes);

export default router;