import { IUser } from "../user";

export interface ITask {
  id: string;
  content: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner: IUser;
};

export interface ITaskRequest {
  content: string;
  owner: IUser;
};

export interface ITaskUpdate {
  content?: string;
};