import jwt from "jsonwebtoken";
import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/AppError";

export const listAllTasksService = async (auth: string) => {
  const userRepository = AppDataSource.getRepository(User);
  const token = auth.split(" ")[1];

  if (!token) {
    throw new AppError(401, "Invalid token");
  }

  const userId = jwt.decode(token)?.sub;
  const currentUser = await userRepository.find({
    where: {
      id: userId as string,
    },
    relations: {
      tasks: true,
    },
  });

  return currentUser[0].tasks;
};
