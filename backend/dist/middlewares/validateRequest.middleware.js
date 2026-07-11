"use strict";
// Genel amacli Zod validasyon middleware'i
// Kullanim: router.post('/register', validateRequest(registerSchema), authController.register)
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
function validateRequest(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Geçersiz veri',
                errors: result.error.flatten().fieldErrors,
            });
        }
        req.body = result.data;
        next();
    };
}
