import { NextFunction, Request, Response } from "express";
import { ValidationError } from "yup";
import { AppError } from "./AppError";

const handleError = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof ValidationError) {
    throw new AppError(400, error.message);
  }

  console.log(error);

  return res.status(500).json({ message: "Internal server error" });
};

export default handleError;