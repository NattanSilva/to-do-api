import { Request, Response } from "express";
import { ITaskUpdate } from "../interfaces/task";
import { createTaskService } from "../services/task/createTask.service";
import { listAllTasksService } from "../services/task/listAllTasks.service";
import { listOneTasksService } from "../services/task/listOneTasks.service";
import { updateTaskService } from "../services/task/updateTask.service";
import {deleteTaskService} from "../services/task/deleteTask.service";

export const createTaskController = async (req: Request, res: Response) => {
  const formatedReturn = await createTaskService(
    req.body,
    req.headers.authorization
  );

  return res.status(201).json(formatedReturn);
};

export const listAllTasksController = async (req: Request, res: Response) => {
  const tasksList = await listAllTasksService(req.headers.authorization);

  return res.status(200).json(tasksList);
};

export const listOneTasksController = async (req: Request, res: Response) => {
  const task = await listOneTasksService(req.params.id);

  return res.status(200).json(task);
};

export const updateTaskController = async (req: Request, res: Response) => {
  const newTaskData: ITaskUpdate = req.body;
  const updatedTask = await updateTaskService(req.params.id, newTaskData);

  return res.status(200).json(updatedTask);
};

export const deleteTaskController = async (req: Request, res: Response) => {
  await deleteTaskService(req.params.id);
  
  return res.status(200).json({});
};
