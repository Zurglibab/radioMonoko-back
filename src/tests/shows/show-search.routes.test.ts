import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../app';
import { showApiService } from '../../services/showServices';
import { StationsEnum } from '../../enums/stationsEnum';

describe('Shows - search endpoint', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns filtered shows matching title', async () => {
    const sampleShows = [
      { id: '1', title: 'Music Show', diffusions: [], taxonomies: [] },
      { id: '2', title: 'News and Talk', diffusions: [], taxonomies: [] },
      { id: '3', title: 'Late Night Music', diffusions: [], taxonomies: [] },
    ] as any[];

    jest.spyOn(showApiService, 'getShowsWithFallback').mockResolvedValue(sampleShows);

    const res = await request(app).get(`/api/shows/${StationsEnum.FRANCEINTER}/search/music`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].title).toBe('Music Show');
    expect(res.body.data[1].title).toBe('Late Night Music');
  });

  it('returns 400 for invalid station', async () => {
    const res = await request(app).get(`/api/shows/INVALID_STATION/search/music`);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
