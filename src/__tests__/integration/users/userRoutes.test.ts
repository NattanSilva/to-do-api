import request from 'supertest';
import { DataSource } from 'typeorm';
import app from '../../../app';
import AppDataSource from '../../../data-source';
import { mockedUser, mockedUserLogin } from '../../mocks';

describe('/users', () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error('Error during Data Source initialization', err);
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test('POST /users -  Must be able to create a user', async () => {
    const response = await request(app).post('/users').send(mockedUser);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body.name).toEqual('Maria');
    expect(response.body.email).toEqual('maria@kenzie.com');
    expect(response.status).toBe(201);
  });

  test('POST /users - should not be able to create user without field', async () => {
    const wrongData = {
      email: 'pedro@mail.com',
      name: 'pedro',
    };

    const response = await request(app).post('/users').send(wrongData);

    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(400);
  });

  test('POST /users - should not be able to create user with a existing email', async () => {
    await request(app).post('/users').send(mockedUser);
    const response = await request(app).post('/users').send({
      name: 'Maria',
      email: 'maria@kenzie.com',
      password: '12345678',
    });

    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(409);
  });

  test('GET /users - should be able to retrieve user data', async () => {
    await request(app).post('/users').send(mockedUser);
    const userLoginResponse = await request(app)
      .post('/login')
      .send(mockedUserLogin);

    const response = await request(app)
      .get('/users')
      .set('authorization', `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body.name).toEqual('Maria');
    expect(response.body.email).toEqual('maria@kenzie.com');
    expect(response.status).toBe(200);
  });

  test('GET /users - should not be able to retrieve user data without authorization', async () => {
    const response = await request(app).get('/users');

    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(401);
  });

  test('PATCH /users - should be able to update user data', async () => {
    const userCreateResponse = await request(app)
      .post('/users')
      .send(mockedUser);
    const userLoginResponse = await request(app)
      .post('/login')
      .send(mockedUserLogin);

    const response = await request(app)
      .patch('/users')
      .set('authorization', `Bearer ${userLoginResponse.body.token}`)
      .send({
        name: 'Maria Pereira',
        email: 'maria2@kenzie.com',
      });

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body.name).toEqual('Maria Pereira');
    expect(response.body.email).toEqual('maria2@kenzie.com');
    expect(response.body.updatedAt).not.toBe(userCreateResponse.body.updatedAt);
    expect(response.status).toBe(200);
  });

  test('PATCH /users - should not be able to update user data without authorization', async () => {
    await request(app).post('/users').send(mockedUser);

    const response = await request(app).patch('/users').send({
      name: 'Maria Pereira',
      email: 'maria2@kenzie.com',
    });

    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(401);
  });

  test('PATCH /users - should not be able to update user', async () => {
    await request(app).post('/users').send(mockedUser);

    const userLoginResponse = await request(app)
      .post('/login')
      .send(mockedUserLogin);

    const response = await request(app)
      .patch('/users')
      .set('authorization', `Bearer ${userLoginResponse.body.token}`)
      .send({
        id: 'fc104b59-15b0-48e8-a39e-f09fb0257476',
        createdAt: new Date(),
      });

    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(401);
  });

  test('DELETE /users - should not be able to delete user without authorization', async () => {
    const response = await request(app).delete('/users');

    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(401);
  });

  test('DELETE /users - should be able to delete user', async () => {
    await request(app).post('/users').send(mockedUser);

    const userLoginResponse = await request(app)
      .post('/login')
      .send(mockedUserLogin);

    const response = await request(app)
      .delete('/users')
      .set('authorization', `Bearer ${userLoginResponse.body.token}`);

    expect(response.status).toBe(200);
  });
});
