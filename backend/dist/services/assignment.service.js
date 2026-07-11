"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignAsset = assignAsset;
exports.returnAsset = returnAsset;
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
async function returnAsset(assignmentId, adminId, ipAddress) {
    const assignment = await database_1.default.assignment.findUnique({
        where: {
            id: assignmentId
        }
    });
    if (!assignment) {
        throw new Error("Zimmet kaydı bulunamadı");
    }
    if (assignment.status !== "ACTIVE") {
        throw new Error("Bu zimmet zaten kapatılmış");
    }
    const updatedAssignment = await database_1.default.assignment.update({
        where: {
            id: assignmentId
        },
        data: {
            status: "RETURNED",
            returnDate: new Date()
        }
    });
    await database_1.default.asset.update({
        where: {
            id: assignment.assetId
        },
        data: {
            status: "ACTIVE"
        }
    });
    await database_1.default.auditLog.create({
        data: {
            userId: adminId,
            action: "RETURN_ASSET",
            entity: "Assignment",
            entityId: assignmentId,
            ipAddress
        }
    });
    return updatedAssignment;
}
