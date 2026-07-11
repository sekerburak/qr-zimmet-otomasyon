"use strict";
// 1. AŞAMA - Authentication Sistemi
// Gercek is mantigi burada: sifre kontrolu, token uretimi, database islemleri
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const database_1 = __importDefault(require("../config/database"));
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const audit_service_1 = require("./audit.service");
async function registerUser(input) {
    // 1) Email zaten var mi kontrol et
    const existingUser = await database_1.default.user.findUnique({
        where: { email: input.email },
    });
    if (existingUser) {
        const error = new Error('Bu email adresi zaten kayıtlı');
        error.statusCode = 409;
        throw error;
    }
    // 2) Sifreyi hashle
    const passwordHash = await (0, hash_1.hashPassword)(input.password);
    // 3) Kullaniciyi olustur (varsayilan rol: PERSONEL)
    const user = await database_1.default.user.create({
        data: {
            name: input.name,
            email: input.email,
            passwordHash,
            role: 'PERSONEL',
        },
    });
    return { id: user.id, name: user.name, email: user.email, role: user.role };
}
async function loginUser(input, ipAddress) {
    // 1) Kullaniciyi bul
    const user = await database_1.default.user.findUnique({ where: { email: input.email } });
    if (!user) {
        const error = new Error('Email veya şifre hatalı');
        error.statusCode = 401;
        throw error;
    }
    // 2) Sifreyi karsilastir
    const isPasswordValid = await (0, hash_1.comparePassword)(input.password, user.passwordHash);
    if (!isPasswordValid) {
        const error = new Error('Email veya şifre hatalı');
        error.statusCode = 401;
        throw error;
    }
    // 3) JWT uret
    const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email, role: user.role });
    // 4) Audit log kaydet
    await (0, audit_service_1.createAuditLog)({
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        ipAddress,
    });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}
