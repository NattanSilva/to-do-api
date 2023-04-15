import jwt from "jsonwebtoken";
import "dotenv/config";
import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { IUserUpdate } from "../../interfaces/user";
import { registResponseBody } from "../../serializers/user.serializers";

export const updateUserService = async (newData: IUserUpdate, auth: string) => {
  const token = auth.split(" ")[1];
  const userId = jwt.decode(token).sub
  const userRepository = AppDataSource.getRepository(User);
  const userToUpdate = await userRepository.findOneBy({
    id: userId as string,
  });

  const updatedUser = userRepository.create({
    ...userToUpdate,
    ...newData
  })

  await userRepository.save(updatedUser)

  const formatedData = await registResponseBody.validate(updatedUser, {
    stripUnknown: true,
    abortEarly: false
  })

  return formatedData;
}