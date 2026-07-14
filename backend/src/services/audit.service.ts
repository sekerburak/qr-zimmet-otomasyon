// 5. AŞAMA - Audit Logging
// Her kritik islemi AuditLog tablosuna kaydeder.
// Kaydedilecek olay tipleri: LOGIN, CREATE_ASSET, UPDATE_ASSET, DELETE_ASSET, ASSIGN_ASSET, RETURN_ASSET

import prisma from '../config/database';

interface AuditLogInput {
  userId?: number;
  action: string;
  entity?: string;
  entityId?: number;
  ipAddress?: string;
}

export async function createAuditLog(data: AuditLogInput) {
  return prisma.auditLog.create({
    data: {
      userId: data.userId,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      ipAddress: data.ipAddress,
    },
  });
}

export async function getAuditLogs(page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      skip,
      take: limit,
      orderBy: { date: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.auditLog.count(),
  ]);

  return { logs, total, page, totalPages: Math.ceil(total / limit) };
}
