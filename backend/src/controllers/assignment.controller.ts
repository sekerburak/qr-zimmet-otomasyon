import { Request, Response, NextFunction } from "express";
import { assignAsset, returnAsset } from "../services/assignment.service";
import prisma from "../config/database";

export async function createAssignment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { assetId, userId } = req.body;

    const result = await assignAsset(
      assetId,
      userId,
      req.user!.id,
      req.ip
    );

    // [Audit Log]: Zimmet oluşturma işlemi loglanıyor
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'ASSIGN_ASSET',
        entity: 'Assignment',
        entityId: result.id, // Servisten dönen zimmet kaydının ID'si
        ipAddress: req.ip
      }
    });

    res.json({
      message: "Zimmet oluşturuldu",
      assignment: result
    });

  } catch (error) {
    next(error);
  }
}

export async function returnAssignment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    const result = await returnAsset(
      id,
      req.user!.id,
      req.ip
    );

    // [Audit Log]: Demirbaş iade alma işlemi loglanıyor
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'RETURN_ASSET',
        entity: 'Assignment',
        entityId: result.id, // İade edilen zimmet kaydının ID'si
        ipAddress: req.ip
      }
    });

    res.json({
      message: "Demirbaş iade alındı",
      assignment: result
    });

  } catch (error) {
    next(error);
  }
}