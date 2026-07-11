"use strict";
// Demirbas + QR islemleri controller'i
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAsset = createAsset;
exports.listAssets = listAssets;
exports.getAssetByQrUuid = getAssetByQrUuid;
const qrService = __importStar(require("../services/qr.service"));
const database_1 = __importDefault(require("../config/database"));
async function createAsset(req, res, next) {
    try {
        const performedByUserId = req.user.id;
        const ipAddress = req.ip;
        const asset = await qrService.createAssetWithQr(req.body, performedByUserId, ipAddress);
        res.status(201).json({ message: 'Demirbaş ve QR kod oluşturuldu', asset });
    }
    catch (error) {
        next(error);
    }
}
async function listAssets(req, res, next) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const [assets, total] = await Promise.all([
            database_1.default.asset.findMany({
                skip,
                take: limit,
                include: { category: true, qrCode: true },
                orderBy: { createdAt: 'desc' },
            }),
            database_1.default.asset.count(),
        ]);
        res.status(200).json({ assets, total, page, totalPages: Math.ceil(total / limit) });
    }
    catch (error) {
        next(error);
    }
}
async function getAssetByQrUuid(req, res, next) {
    try {
        const { uuid } = req.params;
        const asset = await qrService.getAssetByUuid(uuid);
        res.status(200).json({ asset });
    }
    catch (error) {
        next(error);
    }
}
