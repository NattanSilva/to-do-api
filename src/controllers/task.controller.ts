import { Request, Response } from "express";
import { createTaskService } from "../services/task/createTask.service";
import { ITaskRequest } from "../interfaces/task";

export const createTaskController = async (req: Request, res: Response) => {
  const formatedReturn = await createTaskService(req.body, req.headers.authorization);

  return res.status(200).json(formatedReturn)
}