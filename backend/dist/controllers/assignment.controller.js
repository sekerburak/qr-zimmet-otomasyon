"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAssignment = createAssignment;
exports.returnAssignment = returnAssignment;
const assignment_service_1 = require("../services/assignment.service");
async function createAssignment(req, res, next) {
    try {
        const { assetId, userId } = req.body;
        const result = await (0, assignment_service_1.assignAsset)(assetId, userId, req.user.id, req.ip);
        res.json({
            message: "Zimmet oluşturuldu",
            assignment: result
        });
    }
    catch (error) {
        next(error);
    }
}
async function returnAssignment(req, res, next) {
    try {
        const id = Number(req.params.id);
        const result = await (0, assignment_service_1.returnAsset)(id, req.user.id, req.ip);
        res.json({
            message: "Demirbaş iade alındı",
            assignment: result
        });
    }
    catch (error) {
        next(error);
    }
}
