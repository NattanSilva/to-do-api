import { IUserLogin, IUserRequest } from "../../interfaces/user";

const mockedUser: IUserRequest = {
  email: "maria@kenzie.com",
  name: "Maria",
  password: "123maria",
};

const moickedSecondUser: IUserRequest = {
  email: "pedro@kenzie.com",
  name: "Pedro",
  password: "123pedro",
};

const mockedUserLogin: IUserLogin = {
  email: "maria@kenzie.com",
  password: "123maria",
};

const mockedSecondUserLogin: IUserLogin = {
  email: "pedro@kenzie.com",
  password: "123pedro",
};

const mockedTask: any = {
  content: "limpar caixa de areia do gato.",
};

export {
  mockedUser,
  moickedSecondUser,
  mockedUserLogin,
  mockedSecondUserLogin,
  mockedTask,
};
