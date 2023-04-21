import { Router } from "express";
import { validateAuthMiddleware } from "../middlewares/validateAuth.middleware";
import { createTaskController } from "../controllers";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware";
import { taskRegistBody } from "../serializers/task.serializers";
import { validateOwnerData } from "../middlewares/validateOwnerData.middleware";

const taskRoutes = Router();

taskRoutes.post(
  "",
  validateAuthMiddleware,
  validateOwnerData,
  validateBodyMiddleware(taskRegistBody),
  createTaskController
);

export default taskRoutes;