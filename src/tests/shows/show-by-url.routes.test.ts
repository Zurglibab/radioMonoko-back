import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../app';
import { showApiService } from '../../services/showServices';

describe('Shows - show-by-url endpoint', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 400 if url query param is missing', async () => {
    const res = await request(app).get('/api/shows/show-by-url');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 200 and show data when showApiService.getShowByUrl resolves', async () => {
    const sample = {
      id: 'show-1',
      title: 'Sample Show',
      url: 'https://example.org/show-1',
      standFirst: 'A short summary',
      diffusions: [],
      taxonomies: []
    } as any;

    jest.spyOn(showApiService, 'getShowByUrl').mockResolvedValue(sample);

    const res = await request(app).get('/api/shows/show-by-url').query({ url: sample.url });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toMatchObject({ id: sample.id, title: sample.title, url: sample.url });
  });
});

