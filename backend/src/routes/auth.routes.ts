// 1. AŞAMA - Auth route tanimlari

import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

// POST /api/auth/register
router.post('/register', validateRequest(registerSchema), authController.register);

// POST /api/auth/login
router.post('/login', validateRequest(loginSchema), authController.login);

export default router;
