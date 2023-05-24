import { Request, Response } from "express";
import { IUserRequest, IUserUpdate } from "../interfaces/user";
import { createUserService } from "../services/user/createUser.service";
import { retrieveUserService } from "../services/user/retrieveUser.service";
import { updateUserService } from "../services/user/updateUser.service";
import { deleteUserService } from "../services/user/deleteUser.service";

export const createUserController = async (req: Request, res: Response) => {
  const userData: IUserRequest = req.body;
  const createdUserData = await createUserService(userData);

  return res.status(201).json(createdUserData);
};

export const retrieveUserController = async (req: Request, res: Response) => {
  const data = await retrieveUserService(req.headers.authorization);

  return res.status(200).json(data);
};

export const updateUserController = async (req: Request, res: Response) => {
  const data: IUserUpdate = req.body;
  const updatedUserData = await updateUserService(data, req.headers.authorization);
  
  return res.status(200).json(updatedUserData);
};

export const deleteUserController = async (req: Request, res: Response) => {
  await deleteUserService(req.headers.authorization);

  return res.status(200).json();
};