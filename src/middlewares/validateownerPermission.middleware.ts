import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppDataSource from "../data-source";
import { Task } from "../entities/task.entity";
import { AppError } from "../errors/AppError";

export const validateOwnerPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  const token = auth.split(" ")[1];
  const userId = jwt.decode(token)?.sub;
  const taskId = req.params.id;
  const taskRepository = AppDataSource.getRepository(Task);

  const task = await taskRepository.findOne({
    where: {
      id: taskId,
    },
    relations: {
      owner: true,
    },
  });

  if (!task) {
    throw new AppError(404, "Invalid task id");
  }

  if (task.owner.id !== userId) {
    throw new AppError(401, "Invalid token");
  }

  return next(); if (!task) {
    throw new AppError(404, "Invalid task id");
  }
};
