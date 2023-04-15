import { Router } from "express";
import { createSessionController } from "../controllers";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware";
import { loginRequestBody } from "../serializers/user.serializers";

const sessionRoutes = Router();

sessionRoutes.post(
  "",
  validateBodyMiddleware(loginRequestBody),
  createSessionController
)

export default sessionRoutes;