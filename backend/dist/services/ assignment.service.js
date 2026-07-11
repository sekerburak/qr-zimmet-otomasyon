"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignAsset = assignAsset;
const database_1 = __importDefault(require("../config/database"));
async function assignAsset(assetId, userId, adminId, ipAddress) {
    const asset = await database_1.default.asset.findUnique({
        where: { id: assetId }
    });
    if (!asset) {
        throw new Error("Demirbaş bulunamadı");
    }
    const assignment = await database_1.default.assignment.create({
        data: {
            assetId,
            userId
        }
    });
    await database_1.default.asset.update({
        where: { id: assetId },
        data: {
            status: "ASSIGNED"
        }
    });
    await database_1.default.auditLog.create({
        data: {
            userId: adminId,
            action: "ASSIGN_ASSET",
            entity: "Assignment",
            entityId: assignment.id,
            ipAddress
        }
    });
    return assignment;
}
