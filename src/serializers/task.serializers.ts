import * as yup from "yup";
import { SchemaOf } from "yup";
import { ITask, ITaskRequest, ITaskUpdate } from "../interfaces/task";
import { registResponseBody } from "./user.serializers";

const taskRegistBody: SchemaOf<ITaskRequest> = yup.object().shape({
  content: yup.string().required(),
  owner: registResponseBody,
});

const taskResponseBody: SchemaOf<ITask> = yup.object().shape({
  id: yup.string(),
  content: yup.string(),
  completed: yup.boolean(),
  createdAt: yup.date(),
  updatedAt: yup.date(),
  owner: registResponseBody,
});

const taksUpdateRequestBody: SchemaOf<ITaskUpdate> = yup.object().shape({
  content: yup.string().min(1),
  completed: yup.boolean(),
});

export { taskRegistBody, taskResponseBody, taksUpdateRequestBody };
