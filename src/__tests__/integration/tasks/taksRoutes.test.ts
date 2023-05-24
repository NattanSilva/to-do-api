import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import AppDataSource from "../../../data-source";
import {
  mockedSecondUserLogin,
  mockedTask,
  mockedUser,
  mockedUserLogin,
  moickedSecondUser,
} from "../../mocks";

describe("/tasks", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    await request(app).post("/users").send(mockedUser);
    await request(app).post("/users").send(moickedSecondUser);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /tasks - should be able to create a task", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const response = await request(app)
      .post("/tasks")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedTask);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("content");
    expect(response.body).toHaveProperty("completed");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body).toHaveProperty("owner");
    expect(response.body.completed).toBe(false);
    expect(response.body.owner.name).toBe(mockedUser.name);
    expect(response.status).toBe(201);
  });

  test("POST /tasks - should not be able to create a task with a void content", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const response = await request(app)
      .post("/tasks")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)
      .send({
        content: "",
      });

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(400);
  });

  test("POST /tasks - should not be able to create a task for another user", async () => {
    const secondUserCreation = await request(app)
      .post("/users")
      .send(moickedSecondUser);

    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const response = await request(app)
      .post("/tasks")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)
      .send({
        content: "Arrumar a casa.",
        owner: secondUserCreation.body,
      });

    expect(response.body.owner.name).toBe(mockedUser.name);
    expect(response.body.owner.email).toBe(mockedUser.email);
    expect(response.status).toBe(201);
  });

  test("POST /tasks - should not be able to create a task without authorization", async () => {
    const response = await request(app).post("/tasks").send({
      content: "Passear com o gato.",
    });

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("GET /tasks - should be able to list all tasks from current user", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const taskCreation = await request(app)
      .post("/tasks")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedTask);

    const response = await request(app)
      .get("/tasks")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body.length >= 1).toBe(true);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("content");
    expect(response.body[0]).toHaveProperty("completed");
    expect(response.body[0]).toHaveProperty("createdAt");
    expect(response.body[0]).toHaveProperty("updatedAt");
    expect(response.body[0].content).toBe(mockedTask.content);
    expect(response.status).toBe(200);
  });

  test("GET /tasks/:id - should be able to retrieve one task", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const taskCreation = await request(app)
      .post("/tasks")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedTask);

    const response = await request(app)
      .get(`/tasks/${taskCreation.body.id}`)
      .set("authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("content");
    expect(response.body).toHaveProperty("completed");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body).toHaveProperty("owner");
    expect(response.body.content).toBe(mockedTask.content);
    expect(response.status).toBe(200);
  });

  test("GET /tasks/:id - should not be able to retrieve a task without owner permission", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const secondUserLoginResponse = await request(app)
      .post("/login")
      .send(mockedSecondUserLogin);

    const userTaskCreation = await request(app)
      .post("/tasks")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedTask);

    const secondUserTaskCreation = await request(app)
      .post("/tasks")
      .set("authorization", `Bearer ${secondUserLoginResponse.body.token}`)
      .send({
        content: "Lavar Louça do almoço.",
      });

    const response = await request(app)
      .get(`/tasks/${userTaskCreation.body.id}`)
      .set("authorization", `Bearer ${secondUserLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("GET /tasks/:id - should not be able to retrieve one task with invalid id", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const response = await request(app)
      .get("/tasks/478ef6cf-d849-49c3-b3cb-7d9cf51d758d")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("GET /tasks/:id - should not be able to retrieve one task without authorization", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const taskCreation = await request(app)
      .post("/tasks")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedTask);

    const response = await request(app).get(`/tasks/${taskCreation.body.id}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /tasks/:id - should be able to update a task", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const taskCreation = await request(app)
      .post("/tasks")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedTask);

    const response = await request(app)
      .patch(`/tasks/${taskCreation.body.id}`)
      .send({
        content: "Passear com o castor",
      })
      .set("authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("content");
    expect(response.body).toHaveProperty("completed");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body.content).not.toBe(mockedTask.content);
    expect(response.status).toBe(200);
  });

  test("PATCH /tasks/:id - should not be able to update one task without authorization", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const taskCreation = await request(app)
      .post("/tasks")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedTask);

    const response = await request(app).patch(`/tasks/${taskCreation.body.id}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /tasks/:id - should not be able to update a task without owner permission", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const secondUserLoginResponse = await request(app)
      .post("/login")
      .send(mockedSecondUserLogin);

    const userTaskCreation = await request(app)
      .post("/tasks")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedTask);

    const secondUserTaskCreation = await request(app)
      .post("/tasks")
      .send({ content: "Lavar Louça do almoço." })
      .set("authorization", `Bearer ${secondUserLoginResponse.body.token}`);

    const response = await request(app)
      .patch(`/tasks/${userTaskCreation.body.id}`)
      .send({ content: "Passear com o bot" })
      .set("authorization", `Bearer ${secondUserLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /tasks/:id - should not be able to update a task without content", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const taskCreation = await request(app)
      .post("/tasks")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedTask);

    const response = await request(app)
      .patch(`/tasks/${taskCreation.body.id}`)
      .send({
        content: "",
      })
      .set("authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(400);
  });

  test("DELETE /tasks/:id - should be able to delete a task", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const taskCreation = await request(app)
      .post("/tasks")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedTask);

    const response = await request(app)
      .delete(`/tasks/${taskCreation.body.id}`)
      .set("authorization", `Bearer ${userLoginResponse.body.token}`);

    const taskSearch = await request(app)
      .get(`/tasks/${taskCreation.body.id}`)
      .set("authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(taskSearch.body).toHaveProperty("message")
    expect(taskSearch.status).toBe(404)
  });

  test("DELETE /tasks/:id - should not be able to delete a task without authorization", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const taskCreation = await request(app)
      .post("/tasks")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedTask);

    const response = await request(app)
      .delete(`/tasks/${taskCreation.body.id}`)

    const taskSearch = await request(app)
      .get(`/tasks/${taskCreation.body.id}`)
      .set("authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("DELETE /tasks/:id - should not be able to delete a task without owner permission", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const secondUserLoginResponse = await request(app)
      .post("/login")
      .send(mockedSecondUserLogin);

    const taskCreation = await request(app)
      .post("/tasks")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedTask);

    const response = await request(app)
      .delete(`/tasks/${taskCreation.body.id}`)
      .set("authorization", `Bearer ${secondUserLoginResponse.body.token}`)

    const taskSearch = await request(app)
      .get(`/tasks/${taskCreation.body.id}`)
      .set("authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(taskSearch.body).toHaveProperty("content");
    expect(taskSearch.status).toBe(200);
  });

  test("DELETE /tasks/:id - should not be able to delete a task with invalid ID", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const response = await request(app)
      .delete(`/tasks/df8a9e47-9df0-4a2b-bc94-908f89936644`)
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("DELETE /tasks/:id - should not be able to delete a deleted task", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const taskCreation = await request(app)
      .post("/tasks")
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(mockedTask);

    await request(app)
      .delete(`/tasks/${taskCreation.body.id}`)
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)

    const taskSearch = await request(app)
      .get(`/tasks/${taskCreation.body.id}`)
      .set("authorization", `Bearer ${userLoginResponse.body.token}`);

    const response = await request(app)
      .delete(`/tasks/${taskCreation.body.id}`)
      .set("authorization", `Bearer ${userLoginResponse.body.token}`)

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
    expect(taskSearch.body).toHaveProperty("message");
    expect(taskSearch.status).toBe(404);
  });
});
