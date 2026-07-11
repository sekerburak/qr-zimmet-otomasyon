"use strict";
// Audit log goruntuleme route'u - sadece ADMIN
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const audit_service_1 = require("../services/audit.service");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(['ADMIN']), async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const result = await (0, audit_service_1.getAuditLogs)(page, limit);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
