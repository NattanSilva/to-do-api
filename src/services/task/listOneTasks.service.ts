import AppDataSource from "../../data-source";
import { Task } from "../../entities/task.entity";
import { AppError } from "../../errors/AppError";

export const listOneTasksService = async (taskId: string) => {
  const taksRepository = AppDataSource.getRepository(Task);

  const task = await taksRepository.findOne({
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

  return task;
};
