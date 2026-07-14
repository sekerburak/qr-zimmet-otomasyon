import { Request, Response, NextFunction } from "express";
import { findAssetByQr } from "../services/qr.service";


export async function getAssetByQr(
 req: Request,
 res: Response,
 next: NextFunction
){

 try{

 const { uuid } = req.params;


 const result = await findAssetByQr(uuid);


 res.json({
    message:"QR bilgisi getirildi",
    data: result
 });


 }catch(error){

 next(error);

 }

}