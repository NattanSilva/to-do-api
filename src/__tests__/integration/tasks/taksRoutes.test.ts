import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import { mockedUser, mockedUserLogin } from "../../mocks";
import app from "../../../app";

describe("/users", () => {
  let connection: DataSource;

  beforeAll(async() => {
    await AppDataSource.initialize()
    .then((res) => {
      connection = res
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err)
    })

    await request(app).post('/users').send(mockedUser)
  })

  afterAll(async() => {
    await connection.destroy()
  })

  test("POST /tasks - should be able to create a task", async () => {
    const userLoginResponse = await request(app).post("/login").send(mockedUserLogin)

    const response = await request(app).post("/tasks")
  })
})