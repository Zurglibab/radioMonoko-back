import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../app';
import { brandApiService } from '../../services/brandsServices';
import { showApiService } from '../../services/showServices';

jest.mock('../../middlewares/auth.middleware', () => ({
  authMiddleware: jest.fn((req, res, next) => {
    req.user = { id: 'user-1', email: 'test@test.com' };
    req.userId = 'user-1';
    next();
  })
}));

jest.mock('../../services/showServices', () => ({
  showApiService: {
    getShowsFromRedis: jest.fn()
  }
}));

jest.mock('../../services/brandsServices', () => ({
  brandApiService: {
    getBrandsFromRedis: jest.fn()
  }
}));

const mockFindAll = jest.fn();
const mockFindById = jest.fn();
const mockCreate = jest.fn();
const mockUpdateById = jest.fn();
const mockDeleteById = jest.fn();
const mockFindContentStatusByKeys = jest.fn();
const mockUpsertContentStatus = jest.fn();
const mockFindContentFavoriteByKeys = jest.fn();
const mockFindContentFavoritesByUserId = jest.fn();
const mockCreateContentFavorite = jest.fn();
const mockDeleteContentFavoriteByKeys = jest.fn();

const mockFindByApiId = jest.fn();

jest.mock('../../DAO/contentDAO', () => ({
  ContentDAO: jest.fn().mockImplementation(() => ({
    findAll: mockFindAll,
    findById: mockFindById,
    findByApiId: mockFindByApiId,
    create: mockCreate,
    updateById: mockUpdateById,
    deleteById: mockDeleteById
  }))
}));

jest.mock('../../DAO/contentStatusDAO', () => ({
  ContentStatusDAO: jest.fn().mockImplementation(() => ({
    findByKeys: (...args: any[]) => mockFindContentStatusByKeys(...args),
    findLibraryByUserId: (...args: any[]) => jest.fn()(...args),
    upsert: (...args: any[]) => mockUpsertContentStatus(...args)
  }))
}));

jest.mock('../../DAO/contentFavoriteDAO', () => ({
  ContentFavoriteDAO: jest.fn().mockImplementation(() => ({
    findByKeys: mockFindContentFavoriteByKeys,
    findByUserId: mockFindContentFavoritesByUserId,
    create: mockCreateContentFavorite,
    deleteByKeys: mockDeleteContentFavoriteByKeys
  }))
}));

describe('Content Routes with Mocks', () => {
  let app: Express;

  beforeEach(() => {
    jest.clearAllMocks();

    app = createApp();
  });

  describe('GET /content', () => {
    it('should return all contents with status 200', async () => {
      mockFindAll.mockResolvedValue([
      {
        id: 'content-1',
        api_id: 'api-1',
        title: 'Content 1',
        description: 'Description 1',
        content_type: 'article',
        created_at: new Date().toISOString()
      }]
      );

      const res = await request(app).get('/content');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('id', 'content-1');
    });
  });

  describe('GET /content/:id', () => {
    it('should return one content with status 200', async () => {
      mockFindById.mockResolvedValue({
        id: 'content-1',
        api_id: 'api-1',
        title: 'Content 1',
        description: 'Description 1',
        content_type: 'article',
        created_at: new Date().toISOString()
      });

      const res = await request(app).get('/content/content-1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 'content-1');
    });

    it('should return 404 when content does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      const res = await request(app).get('/content/missing-id');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Content not found');
    });
  });

  describe('GET /content/api/:apiId', () => {
    it('should return content from DB if it exists', async () => {
      mockFindByApiId.mockResolvedValue({
        id: 'content-1',
        api_id: 'cf2f690e-5def-49a9-ba02-9f0e427e2be4_1',
        title: 'Existing Content',
        content_type: 'diffusion',
        created_at: new Date().toISOString()
      });

      const res = await request(app).get('/content/api/cf2f690e-5def-49a9-ba02-9f0e427e2be4_1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('api_id', 'cf2f690e-5def-49a9-ba02-9f0e427e2be4_1');
      expect(mockFindByApiId).toHaveBeenCalledWith('cf2f690e-5def-49a9-ba02-9f0e427e2be4_1');
    });

    it('should fallback to Redis and create if not in DB', async () => {
      mockFindByApiId.mockResolvedValue(null);
      (showApiService.getShowsFromRedis as jest.Mock).mockResolvedValue([
        {
          id: 'show-1',
          title: 'A show',
          diffusions: [
            {
              id: 'cf2f690e-5def-49a9-ba02-9f0e427e2be4_1',
              title: 'A diffusion'
            }
          ]
        }
      ]);
      mockCreate.mockResolvedValue({
        id: 'new-content-id',
        api_id: 'cf2f690e-5def-49a9-ba02-9f0e427e2be4_1',
        title: 'A diffusion',
        content_type: 'diffusion',
        created_at: new Date().toISOString()
      });

      const res = await request(app).get('/content/api/cf2f690e-5def-49a9-ba02-9f0e427e2be4_1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('api_id', 'cf2f690e-5def-49a9-ba02-9f0e427e2be4_1');
      expect(res.body).toHaveProperty('title', 'A diffusion');
      expect(mockCreate).toHaveBeenCalled();
    });

    it('should return 404 if not found anywhere', async () => {
      mockFindByApiId.mockResolvedValue(null);
      (showApiService.getShowsFromRedis as jest.Mock).mockResolvedValue([]);
      (brandApiService.getBrandsFromRedis as jest.Mock).mockResolvedValue([]);

      const res = await request(app).get('/content/api/unknown-id');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Content not found for api_id: unknown-id');
    });
  });

  describe('POST /content', () => {
    it('should create a content and return 201', async () => {
      mockCreate.mockResolvedValue({
        id: 'content-2',
        api_id: 'api-2',
        title: 'New Content',
        description: 'New Description',
        content_type: 'show',
        created_at: new Date().toISOString()
      });

      const payload = {
        api_id: 'api-2',
        title: 'New Content',
        description: 'New Description',
        content_type: 'show'
      };

      const res = await request(app).
      post('/content').
      send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id', 'content-2');
    });

    it('should return 400 when payload is incomplete', async () => {
      const res = await request(app).
      post('/content').
      send({ title: 'Invalid' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'api_id, title and content_type are required');
    });
  });

  describe('PUT /content/:id', () => {
    it('should update content and return 200', async () => {
      mockUpdateById.mockResolvedValue({
        id: 'content-1',
        api_id: 'api-1',
        title: 'Updated title',
        description: 'Updated description',
        content_type: 'podcast',
        created_at: new Date().toISOString()
      });

      const res = await request(app).
      put('/content/content-1').
      send({ title: 'Updated title', content_type: 'podcast' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', 'Updated title');
    });

    it('should return 404 when updating unknown content', async () => {
      mockUpdateById.mockResolvedValue(null);

      const res = await request(app).
      put('/content/missing-id').
      send({ title: 'Updated title' });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Content not found');
    });
  });

  describe('DELETE /content/:id', () => {
    it('should delete content and return 200', async () => {
      mockDeleteById.mockResolvedValue({
        id: 'content-1',
        api_id: 'api-1',
        title: 'To delete',
        description: 'To delete',
        content_type: 'article',
        created_at: new Date().toISOString()
      });

      const res = await request(app).delete('/content/content-1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 'content-1');
    });

    it('should return 404 when deleting unknown content', async () => {
      mockDeleteById.mockResolvedValue(null);

      const res = await request(app).delete('/content/missing-id');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Content not found');
    });
  });

  describe('GET /content/status/:contentId/user/:userId', () => {
    it('should return one content status with status 200', async () => {
      mockFindContentStatusByKeys.mockResolvedValue({
        content_id: 'content-1',
        user_id: 'user-1',
        status: 'commencer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      const res = await request(app).get('/content/status/content-1/user/user-1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('content_id', 'content-1');
      expect(res.body).toHaveProperty('status', 'commencer');
    });

    it('should return 404 when content status does not exist', async () => {
      mockFindContentStatusByKeys.mockResolvedValue(null);

      const res = await request(app).get('/content/status/missing-content/user/user-1');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Content status not found');
    });
  });

  describe('GET /content/status/list', () => {
    it('should return the list of content statuses with status 200', async () => {
      const res = await request(app).get('/content/status/list');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.arrayContaining(['abandonné', 'à voir', 'en cours', 'commencer', 'fini']));
      expect(res.body.length).toBe(5);
    });
  });

  describe('PUT /content/status', () => {
    it('should upsert content status and return 200', async () => {
      mockUpsertContentStatus.mockResolvedValue({
        content_id: 'content-1',
        user_id: 'user-1',
        status: 'fini',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      const res = await request(app).put('/content/status').send({
        content_id: 'content-1',
        user_id: 'user-1',
        status: 'fini'
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'fini');
    });

    it('should return 400 when payload is invalid', async () => {
      const res = await request(app).put('/content/status').send({
        content_id: 'content-1',
        user_id: 'user-1',
        status: 'invalid'
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /content/favorites/user/:userId', () => {
    it('should return all favorites for a user with status 200', async () => {
      mockFindContentFavoritesByUserId.mockResolvedValue([
        {
          content_id: 'content-1',
          user_id: 'user-1',
          created_at: new Date().toISOString()
        }
      ]);

      const res = await request(app).get('/content/favorites/user/user-1');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('content_id', 'content-1');
    });
  });

  describe('GET /content/favorites/:contentId/user/:userId', () => {
    it('should return one favorite with status 200', async () => {
      mockFindContentFavoriteByKeys.mockResolvedValue({
        content_id: 'content-1',
        user_id: 'user-1',
        created_at: new Date().toISOString()
      });

      const res = await request(app).get('/content/favorites/content-1/user/user-1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('content_id', 'content-1');
    });

    it('should return 404 when favorite does not exist', async () => {
      mockFindContentFavoriteByKeys.mockResolvedValue(null);

      const res = await request(app).get('/content/favorites/missing-content/user/user-1');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Content favorite not found');
    });
  });

  describe('POST /content/favorites', () => {
    it('should create a favorite and return 201', async () => {
      mockCreateContentFavorite.mockResolvedValue({
        content_id: 'content-1',
        user_id: 'user-1',
        created_at: new Date().toISOString()
      });

      const res = await request(app).post('/content/favorites').send({
        content_id: 'content-1',
        user_id: 'user-1'
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('content_id', 'content-1');
    });
  });

  describe('DELETE /content/favorites/:contentId/user/:userId', () => {
    it('should delete a favorite and return 200', async () => {
      mockDeleteContentFavoriteByKeys.mockResolvedValue({
        content_id: 'content-1',
        user_id: 'user-1',
        created_at: new Date().toISOString()
      });

      const res = await request(app).delete('/content/favorites/content-1/user/user-1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('content_id', 'content-1');
    });
  });
});