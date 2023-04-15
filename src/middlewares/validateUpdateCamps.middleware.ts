import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export const validateUpdateCamps = async (req: Request, res: Response, next: NextFunction) => {
  if( req.body.id) {
    throw new AppError(401, "Unauthorized camp - Id")
  }

  if( req.body.createdAt) {
    throw new AppError(401, "Unauthorized camp - createdAt")
  }

  if(req.body.isActive == true || req.body.isActive == false) {
    throw new AppError(401, "Unauthorized camp - isActive")
  }

  return next()
}