import { Router } from "express";

import {
createAssignment,
returnAssignment
} from "../controllers/assignment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";


const router = Router();

router.patch(
 "/:id/return",
 authMiddleware,
 roleMiddleware(["ADMIN","DEPO"]),
 returnAssignment
);

router.post(
 "/",
 authMiddleware,
 roleMiddleware(["ADMIN","DEPO"]),
 createAssignment
);


export default router;