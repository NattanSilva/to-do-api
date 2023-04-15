import * as yup from "yup";
import { SchemaOf } from "yup";
import { IUser, IUserLogin, IUserRequest, IUserUpdate } from "../interfaces/user";

const registRequestBody: SchemaOf<IUserRequest> = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

const registResponseBody: SchemaOf<IUser> = yup.object().shape({
  id: yup.string().required(),
  name: yup.string().required(),
  email: yup.string().required(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required(),
});

const loginRequestBody: SchemaOf<IUserLogin> = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
}) 

const UpdateRequestBody: SchemaOf<IUserUpdate> = yup.object().shape({
  email: yup.string().email(),
  name: yup.string(),
  password: yup.string()
})

export { 
  registRequestBody,
  registResponseBody,
  loginRequestBody,
  UpdateRequestBody
};