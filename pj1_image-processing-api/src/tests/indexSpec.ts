import supertest from 'supertest';
import app from '../index';
import { promises as fs } from 'fs';
import path from 'path';
import File from './../file';

const request: supertest.SuperTest<supertest.Test> = supertest(app);

describe('Test responses from endpoints', (): void => {
  describe('endpoint: /', (): void => {
    it('gets /', async (): Promise<void> => {
      const response: supertest.Response = await request.get('/');

      expect(response.status).toBe(200);
    });
  });

  describe('endpoint: /images', (): void => {
    it('gets /images?filename=HaLongBay (valid args)', async (): Promise<void> => {
      const response: supertest.Response = await request.get(
        '/images?filename=HaLongBay'
      );

      expect(response.status).toBe(200);
    });

    it('gets /images?filename=HaLongBay&width=199&height=199 (valid args)', async (): Promise<void> => {
      const response: supertest.Response = await request.get(
        '/images?filename=HaLongBay&width=199&height=199'
      );

      expect(response.status).toBe(200);
    });

    it('gets /images?filename=HaLongBay&width=-200&height=200 (invalid args)', async (): Promise<void> => {
      const response: supertest.Response = await request.get(
        '/images?filename=HaLongBay&width=-200&height=200'
      );

      expect(response.status).toBe(200);
    });

    it('gets /images (no arguments)', async (): Promise<void> => {
      const response: supertest.Response = await request.get('/images');

      expect(response.status).toBe(200);
    });
  });

  describe('endpoint: /zoo', (): void => {
    it('returns 404 for invalid endpoint', async (): Promise<void> => {
      const response: supertest.Response = await request.get('/zoo');

      expect(response.status).toBe(404);
    });
  });
});

// Erase test file. Test should not run on productive system to avoid cache loss
afterAll(async (): Promise<void> => {
  const resizedImagePath: string = path.resolve(
    File.imagesThumbPath,
    'HaLongBay-199x199.jpg'
  );

  try {
    await fs.access(resizedImagePath);
    fs.unlink(resizedImagePath);
  } catch {
    // intentionally left blank
  }
});
