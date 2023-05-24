import "dotenv/config"
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import AppDataSource from "../data-source";
import { User } from "../entities/user.entity";

export const validateAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;

  if(!auth) {
    throw new AppError(401, "Invalid token");
  }

  const token: string = auth.split(" ")[1];

  if(!token) {
    throw new AppError(401, "Invalid token");
  }

  jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
    if (error) {
      throw new AppError(401, error.message);
    }
  });

  return next();
}