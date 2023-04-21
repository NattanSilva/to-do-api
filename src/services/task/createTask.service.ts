import jwt from "jsonwebtoken"
import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { Task } from "../../entities/task.entity";
import { ITaskRequest } from "../../interfaces/task";
import { taskResponseBody } from "../../serializers/task.serializers";
import { AppError } from "../../errors/AppError";

export const createTaskService = async (taskData: ITaskRequest, auth: string) => {
  const token = auth.split(" ")[1];
  const userId = jwt.decode(token)?.sub;
  const userRespository = AppDataSource.getRepository(User);
  const taskRepository = AppDataSource.getRepository(Task);
  const currentUser = await userRespository.findOneBy({
    id: userId as string,
  });

  if(!currentUser) {
    throw new AppError(401 ,"Invalid token");
  }

  const createdTask = taskRepository.create({
    ...taskData,
    owner: currentUser,
  });

  await taskRepository.save(createdTask);

  const formatedResponse = await taskResponseBody.validate( createdTask, {
    stripUnknown: true,
    abortEarly: false,
  })

  return formatedResponse;
}