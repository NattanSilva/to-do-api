import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppDataSource from "../data-source";
import { User } from "../entities/user.entity";
import { AppError } from "../errors/AppError";

export const validateOwnerData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization.split(" ")[1];
  const ownerId = jwt.decode(token)?.sub;

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({
    id: ownerId as string
  })

  if(!user) {
    throw new AppError(401, "Invalid token")
  }

  req.decodedData = user;
  req.typeValidation = "task";

  return next();
}