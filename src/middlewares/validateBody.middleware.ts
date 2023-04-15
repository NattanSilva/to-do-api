import {Request, Response, NextFunction} from "express";
import { AnySchema } from "yup";
import { AppError } from "../errors/AppError";

export const validateBodyMiddleware = (schema: AnySchema) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validate(req.body, {
      stripUnknown: true,
      abortEarly: false
    })

    return next();
  } catch (error) {
    if( error instanceof Error){
      throw new AppError(400, error.message)
    }
  }
};