// Audit log goruntuleme route'u - sadece ADMIN

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { getAuditLogs } from '../services/audit.service';
import { Request, Response, NextFunction } from 'express';

const router = Router();

router.get(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await getAuditLogs(page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
