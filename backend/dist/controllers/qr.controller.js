"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetByQr = getAssetByQr;
const qr_service_1 = require("../services/qr.service");
async function getAssetByQr(req, res, next) {
    try {
        const { uuid } = req.params;
        const result = await (0, qr_service_1.findAssetByQr)(uuid);
        res.json({
            message: "QR bilgisi getirildi",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
}
