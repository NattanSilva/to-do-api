import { Router } from "express";
import {
    createTaskController,
    deleteTaskController,
    listAllTasksController,
    listOneTasksController,
    updateTaskController,
} from "../controllers";

import { validateAuthMiddleware } from "../middlewares/validateAuth.middleware";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware";
import { validateOwnerData } from "../middlewares/validateOwnerData.middleware";
import { validateOwnerPermission } from "../middlewares/validateownerPermission.middleware";
import {
  taksUpdateRequestBody,
  taskRegistBody,
} from "../serializers/task.serializers";

const taskRoutes = Router();

taskRoutes.post(
  "",
  validateAuthMiddleware,
  validateOwnerData,
  validateBodyMiddleware(taskRegistBody),
  createTaskController
);

taskRoutes.get("", validateAuthMiddleware, listAllTasksController);

taskRoutes.get(
  "/:id",
  validateAuthMiddleware,
  validateOwnerPermission,
  listOneTasksController
);

taskRoutes.patch(
  "/:id",
  validateAuthMiddleware,
  validateOwnerPermission,
  validateBodyMiddleware(taksUpdateRequestBody),
  updateTaskController
);

taskRoutes.delete("/:id", validateAuthMiddleware, validateOwnerPermission, deleteTaskController)

export default taskRoutes;
