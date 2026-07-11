"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const asset_routes_1 = __importDefault(require("./asset.routes"));
const audit_routes_1 = __importDefault(require("./audit.routes"));
const assignment_routes_1 = __importDefault(require("./assignment.routes"));
const qr_routes_1 = __importDefault(require("./qr.routes"));
const router = (0, express_1.Router)();
router.use("/qr", qr_routes_1.default);
router.use("/auth", auth_routes_1.default);
router.use("/assets", asset_routes_1.default);
router.use("/audit-logs", audit_routes_1.default);
router.use("/assignments", assignment_routes_1.default);
exports.default = router;
