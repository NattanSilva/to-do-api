import "dotenv/config";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserLogin } from "../../interfaces/user";
import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/AppError";

export const createSessionService = async ({ email, password }: IUserLogin) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({
    email,
  });

  if(!user) {
    throw new AppError(401, "invalid email or password")
  }

  const passwordMatch = await compare(password, user.password)

  if(!passwordMatch) {
    throw new AppError(401, "invalid email or password")
  }

  const token = jwt.sign({}, process.env.SECRET_KEY, {
    subject: user.id,
    expiresIn: "24H",
  });

  return {token}
}