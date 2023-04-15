import { NextFunction, Request, Response } from "express";
import AppDataSource from "../data-source";
import { User } from "../entities/user.entity";
import { AppError } from "../errors/AppError";

export const validateUniqueEmailMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({
    email: body.email
  })

  if(user) {
    throw new AppError(409, "This email already exists")
  }

  return next()
}