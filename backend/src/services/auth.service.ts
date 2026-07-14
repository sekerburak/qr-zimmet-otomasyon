// 1. AŞAMA - Authentication Sistemi
// Gercek is mantigi burada: sifre kontrolu, token uretimi, database islemleri

import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { createAuditLog } from './audit.service';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export async function registerUser(input: RegisterInput) {
  // 1) Email zaten var mi kontrol et
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    const error: any = new Error('Bu email adresi zaten kayıtlı');
    error.statusCode = 409;
    throw error;
  }

  // 2) Sifreyi hashle
  const passwordHash = await hashPassword(input.password);

  // 3) Kullaniciyi olustur (varsayilan rol: PERSONEL)
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: 'PERSONEL',
    },
  });

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function loginUser(input: LoginInput, ipAddress?: string) {
  // 1) Kullaniciyi bul
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    const error: any = new Error('Email veya şifre hatalı');
    error.statusCode = 401;
    throw error;
  }

  // 2) Sifreyi karsilastir
  const isPasswordValid = await comparePassword(input.password, user.passwordHash);

  if (!isPasswordValid) {
    const error: any = new Error('Email veya şifre hatalı');
    error.statusCode = 401;
    throw error;
  }

  // 3) JWT uret
  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  // 4) Audit log kaydet
  await createAuditLog({
    userId: user.id,
    action: 'LOGIN',
    entity: 'User',
    entityId: user.id,
    ipAddress,
  });

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}
