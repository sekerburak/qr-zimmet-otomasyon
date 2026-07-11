"use strict";
// 5. AŞAMA - Audit Logging
// Her kritik islemi AuditLog tablosuna kaydeder.
// Kaydedilecek olay tipleri: LOGIN, CREATE_ASSET, UPDATE_ASSET, DELETE_ASSET, ASSIGN_ASSET, RETURN_ASSET
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = createAuditLog;
exports.getAuditLogs = getAuditLogs;
const database_1 = __importDefault(require("../config/database"));
async function createAuditLog(data) {
    return database_1.default.auditLog.create({
        data: {
            userId: data.userId,
            action: data.action,
            entity: data.entity,
            entityId: data.entityId,
            ipAddress: data.ipAddress,
        },
    });
}
async function getAuditLogs(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
        database_1.default.auditLog.findMany({
            skip,
            take: limit,
            orderBy: { date: 'desc' },
            include: { user: { select: { id: true, name: true, email: true } } },
        }),
        database_1.default.auditLog.count(),
    ]);
    return { logs, total, page, totalPages: Math.ceil(total / limit) };
}
