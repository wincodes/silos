import supertest from 'supertest';
import http from 'http';
import app from '../src/app';

process.env.NODE_ENV = 'test';

describe('get categories test', () => {
  let server;
  let request;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(done);
    request = supertest(server);
    jest.setTimeout(10 * 1000);
  });

  afterAll((done) => {
    server.close(done);
  });

  test('it should return status of 200', async (done) => {
    const res = await request.get('/api/v1/categories');

    expect(res.status).toBe(200);
    done();
  });

  test('it returns the categories', async (done) => {
    const res = await request.get('/api/v1/categories');

    expect(res.body.status).toBe('success');
    expect(res.body.data.categories).not.toBeNull();
    done();
  });
});
