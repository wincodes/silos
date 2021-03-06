import supertest from 'supertest';
import http from 'http';
import app from '../src/app';
import productsFactory from '../src/factory/productsFactory';

process.env.NODE_ENV = 'test';

describe('get products', () => {
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

  test('it should return status of 200 ad the array of products', async (done) => {
    // use productsfactory to create products
    await productsFactory.createMany(3);

    const res = await request.get('/api/v1/products?page=1');

    const { products } = res.body.data;

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(products.length).toBeGreaterThan(2);
    done();
  });

  test('it return rows perpage, currentPage and total records', async (done) => {
    // get counnt of all existing products
    const productsCount = await productsFactory.productsCount();

    const res = await request.get('/api/v1/products?page=1');

    const { currentPage, rowsPerPage, totalProducts } = res.body.data;

    expect(currentPage).toBe(1);
    expect(rowsPerPage).toBe(30);
    expect(totalProducts).toBe(productsCount);
    done();
  });
});
