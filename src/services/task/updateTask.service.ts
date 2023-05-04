import AppDataSource from "../../data-source";
import { Task } from "../../entities/task.entity";
import { AppError } from "../../errors/AppError";
import { ITaskUpdate } from "../../interfaces/task";

export const updateTaskService = async (
  taskId: string,
  newTaskData: ITaskUpdate
) => {
  const taskRepository = AppDataSource.getRepository(Task);
  const currentTask = await taskRepository.findOneBy({
    id: taskId,
  });

  if (!currentTask) {
    throw new AppError(404, "invalid task id");
  }

  const updatedTask = taskRepository.create({
    ...currentTask,
    ...newTaskData,
  });

  await taskRepository.save(updatedTask);

  return updatedTask;
};
