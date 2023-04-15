import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import jwt from "jsonwebtoken";
import { AppError } from "../../errors/AppError";

export const deleteUserService = async (auth: string) => {
  const token = auth.split(" ")[1];
  const userRepository = AppDataSource.getRepository(User);
  const userId = jwt.decode(token)?.sub;
  
  userRepository.createQueryBuilder()
  .delete()
  .from(User)
  .where("id = :id", { id: userId })
}