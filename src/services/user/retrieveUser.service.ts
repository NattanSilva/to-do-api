import jwt from "jsonwebtoken";
import "dotenv/config";
import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/AppError";
import { registResponseBody } from "../../serializers/user.serializers";

export const retrieveUserService = async (auth: string) => {
  const token = auth.split(" ")[1];
  const userId = jwt.decode(token).sub
  const userRepository = AppDataSource.getRepository(User)
  const user = await userRepository.findOneBy({
    id: userId as string
  })

  if(!User){
    throw new AppError(404, "Invalid user id")
  }

  let finalDataFormated = await registResponseBody.validate(user, {
    stripUnknown: true,
    abortEarly: false,
  });

  return finalDataFormated;
}