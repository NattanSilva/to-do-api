import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { mockedUser, mockedUserLogin } from "../../mocks"

describe("/session", () => {
  let connection: DataSource;
  
  beforeAll(async() => {
    await AppDataSource.initialize()
    .then((res) => {
      connection = res
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err)
    })
  })

  afterAll(async() => {
    await connection.destroy()
  })

  test("POST /login - should be able to create a session", async () => {
    await request(app).post('/users').send(mockedUser)
    const response = await request(app).post("/login").send(mockedUserLogin)

    expect(response.body).toHaveProperty("token")
    expect(response.status).toBe(200)
  })

  test("POST /login - should not be able to create a session without credentials", async () => {
    const response = await request(app).post("/login").send({})

    expect(response.body).toHaveProperty("message")
    expect(response.status).toBe(400)
  })

  test("POST /login - should not be able to create a session with wrong credentials", async () => {
    const response = await request(app).post("/login").send({
      email: "maria@kenzie.com",
      password: "4567test"
    })

    expect(response.body).toHaveProperty("message")
    expect(response.status).toBe(401)
  })
})