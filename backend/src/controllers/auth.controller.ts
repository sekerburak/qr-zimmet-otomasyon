// 1. AŞAMA - Authentication Sistemi
// Controller: sadece HTTP istegini karsilar, gercek isi service'e devreder

import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ message: 'Kayıt başarılı', user });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const ipAddress = req.ip;
    const result = await authService.loginUser(req.body, ipAddress);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
