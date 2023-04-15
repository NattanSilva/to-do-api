import { Router, Response, Request } from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware";
import { UpdateRequestBody, registRequestBody } from "../serializers/user.serializers"
import { validateUniqueEmailMiddleware } from "../middlewares/validateUniqueEmail.middleware";
import { createUserController, retrieveUserController, updateUserController } from "../controllers";
import { validateAuthMiddleware } from "../middlewares/validateAuth.middleware";
import { validateUpdateCamps } from "../middlewares/validateUpdateCamps.middleware";
import { deleteUserController } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post(
  "", 
  validateBodyMiddleware(registRequestBody),
  validateUniqueEmailMiddleware,
  createUserController
)

userRoutes.get(
  "", 
  validateAuthMiddleware,
  retrieveUserController
)

userRoutes.patch(
  "",
  validateAuthMiddleware,
  validateUpdateCamps,
  validateBodyMiddleware(UpdateRequestBody),
  updateUserController
)

userRoutes.delete(
  "",
  validateAuthMiddleware,
  deleteUserController
)

export default userRoutes;