import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { IUserRequest } from "../../interfaces/user";
import { AnySchema } from "yup";
import { registResponseBody } from "../../serializers/user.serializers";

export const createUserService = async (userData: IUserRequest) => {
  const userRepo = AppDataSource.getRepository(User)
  const createdUser = userRepo.create(userData);
  await userRepo.save(createdUser);

  let finalDataFormated = await registResponseBody.validate(createdUser, {
    stripUnknown: true,
    abortEarly: false,
  });

  return finalDataFormated;
}