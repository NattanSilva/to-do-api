import { IUser, IUserLogin, IUserRequest } from "../../interfaces/user"

const mockedUser: IUserRequest = {
  email: "maria@kenzie.com",
  name: "Maria",
  password: "123maria",
}

const mockedUserLogin: IUserLogin = {
  email: "maria@kenzie.com",
  password: "123maria",
}

export { mockedUser, mockedUserLogin }