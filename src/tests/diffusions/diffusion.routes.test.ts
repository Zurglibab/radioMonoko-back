import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../app';

import { diffusionApiService } from '../../services/diffusionServices';

jest.mock('../../services/diffusionServices', () => ({
  diffusionApiService: {
    getDiffusionsOfShowByUrl: jest.fn(),
    getDiffusions: jest.fn()
  }
}));

const mockedDiffusionApiService = diffusionApiService as {
  getDiffusionsOfShowByUrl: jest.Mock;
  getDiffusions: jest.Mock;
};

describe('Diffusion Routes with Mocks', () => {
  let app: Express;

  beforeEach(() => {
    jest.clearAllMocks();
    app = createApp();
  });

  describe('GET /api/diffusions/show-by-url', () => {
    it('should return diffusions for a show URL', async () => {
      mockedDiffusionApiService.getDiffusionsOfShowByUrl.mockResolvedValue([
        {
          id: 'diffusion-1',
          title: 'Episode 1',
          url: 'https://www.radiofrance.fr/episode-1',
          publishedDate: '2026-01-01T00:00:00.000Z',
          podcastEpisode: {
            id: 'podcast-1',
            title: 'Podcast Episode 1',
            url: 'https://www.radiofrance.fr/podcast-1',
            playerUrl: 'https://player.radiofrance.fr/podcast-1'
          },
          taxonomies: []
        }
      ]);

      const res = await request(app)
        .get('/api/diffusions/show-by-url')
        .query({
          url: 'https://www.radiofrance.fr/franceculture/podcasts/fictions-theatre-et-cie',
          first: '10'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('count', 1);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0]).toHaveProperty('id', 'diffusion-1');
      expect(res.body.data[0]).toHaveProperty('podcastEpisode.id', 'podcast-1');
      expect(mockedDiffusionApiService.getDiffusionsOfShowByUrl).toHaveBeenCalledWith(
        'https://www.radiofrance.fr/franceculture/podcasts/fictions-theatre-et-cie',
        10
      );
    });

    it('should return 400 when url is missing', async () => {
      const res = await request(app).get('/api/diffusions/show-by-url');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error', 'Missing required query param: url');
    });
  });
});

