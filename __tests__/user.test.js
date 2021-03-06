import supertest from 'supertest';
import http from 'http';
import Chance from 'chance';
import app from '../src/app';

const chance = new Chance();

process.env.NODE_ENV = 'test';

describe('User Profile Test', () => {
  let server;
  let request;

  beforeAll(async (done) => {
    server = http.createServer(app);
    server.listen(done);
    request = supertest(server);
    jest.setTimeout(10 * 1000);
  });

  afterAll((done) => {
    server.close(done);
  });

  test('it should show the user profile.', async (done) => {
    // the user details
    const userDetails = {
      firstName: chance.first(),
      lastName: chance.last(),
      email: chance.email(),
      password: 'dhye%$&6*',
      phoneNumber: chance.phone(),
      userType: 'producer',
      businessName: chance.name(),
      bio: chance.sentence(),
      address: chance.address()
    };

    const registerResponse = await request.post('/api/v1/auth/register').send(userDetails);

    const loginDetails = {
      email: userDetails.email,
      password: 'dhye%$&6*'
    };

    const loginResponse = await request.post('/api/v1/auth/signin').send(loginDetails);

    const res = await request.get(`/api/v1/users/${registerResponse.body.data.userId}`).set('Authorization', `Bearer ${loginResponse.body.data.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.user).toBeTruthy();
    done();
  });

  test('it should return appropriate if user does not exist.', async (done) => {
    // the user details
    const userDetails = {
      firstName: chance.first(),
      lastName: chance.last(),
      email: chance.email(),
      password: 'dhye%$&6*',
      phoneNumber: chance.phone(),
      userType: 'producer',
      businessName: chance.name(),
      bio: chance.sentence(),
      address: chance.address()
    };

    await request.post('/api/v1/auth/register').send(userDetails);

    const loginDetails = {
      email: userDetails.email,
      password: 'dhye%$&6*'
    };

    const loginResponse = await request.post('/api/v1/auth/signin').send(loginDetails);

    const res = await request.get('/api/v1/users/10000').set('Authorization', `Bearer ${loginResponse.body.data.token}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe('User does not exist.');
    done();
  });

  test('it should prevent access for unauthorized users', async (done) => {
    // the user details
    const userDetails = {
      firstName: chance.first(),
      lastName: chance.last(),
      email: chance.email(),
      password: 'dhye%$&6*',
      phoneNumber: chance.phone(),
      userType: 'producer',
      businessName: chance.name(),
      bio: chance.sentence(),
      address: chance.address()
    };

    const registerResponse = await request.post('/api/v1/auth/register').send(userDetails);

    const res = await request.get(`/api/v1/users/${registerResponse.body.data.userId}`);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toMatchObject({
      status: 'error',
      errors: { message: 'Unauthenticated User' }
    });
    done();
  });
});
