import { Request, Response, NextFunction } from "express";
import { assignAsset, returnAsset } from "../services/assignment.service";


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


    res.json({
      message: "Demirbaş iade alındı",
      assignment: result
    });


  } catch (error) {

    next(error);

  }

}