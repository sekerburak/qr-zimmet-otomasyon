import { Router } from "express";
import { getAssetByQr } from "../controllers/qr.controller";

const router = Router();

router.get("/:uuid", getAssetByQr);

export default router;