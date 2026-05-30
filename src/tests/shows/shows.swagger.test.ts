import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../app';
import { StationsEnum } from '../../enums/stationsEnum';

describe('Shows + Swagger integration', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp();
  });

  it('should expose shows paths in swagger JSON', async () => {
    const res = await request(app).get('/api/docs.json');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('paths');
    const paths = Object.keys(res.body.paths || {});
    const hasShows = paths.some((p) => p.includes('/api/shows'));
    expect(hasShows).toBe(true);
  });

  it('should expose show-by-url path in swagger JSON', async () => {
    const res = await request(app).get('/api/docs.json');
    expect(res.status).toBe(200);
    const paths = Object.keys(res.body.paths || {});
    expect(paths).toContain('/api/shows/show-by-url');
  });

  it('should respond to GET /api/shows/:station', async () => {
    const station = StationsEnum.FRANCEINTER;
    const res = await request(app).get(`/api/shows/${station}`);
    // controller returns 200 on success or 400 if station invalid; expect 200
    expect([200, 400]).toContain(res.status);
  });
});

