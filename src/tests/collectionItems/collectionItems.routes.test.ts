import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../app';
import { CollectionItemsDTO } from '../../DAO/collectionItemsDTO';

jest.mock('../../middlewares/auth.middleware', () => ({
  authMiddleware: jest.fn((req, res, next) => {
    req.user = { id: 'user-1', email: 'test@test.com' };
    req.userId = 'user-1';
    next();
  })
}));

jest.mock('../../DAO/collectionItemsDTO');

describe('CollectionItems Routes with Mocks', () => {
  let app: Express;
  let mockFindAll: jest.Mock;
  let mockFindByCollectionId: jest.Mock;
  let mockFindByKeys: jest.Mock;
  let mockCreate: jest.Mock;
  let mockUpdateByKeys: jest.Mock;
  let mockDeleteByKeys: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockFindAll = jest.fn();
    mockFindByCollectionId = jest.fn();
    mockFindByKeys = jest.fn();
    mockCreate = jest.fn();
    mockUpdateByKeys = jest.fn();
    mockDeleteByKeys = jest.fn();

    CollectionItemsDTO.prototype.findAll = mockFindAll;
    CollectionItemsDTO.prototype.findByCollectionId = mockFindByCollectionId;
    CollectionItemsDTO.prototype.findByKeys = mockFindByKeys;
    CollectionItemsDTO.prototype.create = mockCreate;
    CollectionItemsDTO.prototype.updateByKeys = mockUpdateByKeys;
    CollectionItemsDTO.prototype.deleteByKeys = mockDeleteByKeys;

    app = createApp();
  });

  describe('GET /collectionItems', () => {
    it('should return all collection items with status 200', async () => {
      mockFindAll.mockResolvedValue([
      {
        collection_id: 'collection-1',
        content_id: 'content-1',
        position: 1,
        note: 'First item',
        created_at: new Date().toISOString()
      }]
      );

      const res = await request(app).get('/collectionItems');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('collection_id', 'collection-1');
    });
  });

  describe('GET /collectionItems/collection/:collectionId', () => {
    it('should return items for a collection with status 200', async () => {
      mockFindByCollectionId.mockResolvedValue([
      {
        collection_id: 'collection-1',
        content_id: 'content-1',
        position: 1,
        note: 'First item',
        created_at: new Date().toISOString()
      }]
      );

      const res = await request(app).get('/collectionItems/collection/collection-1');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /collectionItems/collection/:collectionId/content/:contentId', () => {
    it('should return one collection item with status 200', async () => {
      mockFindByKeys.mockResolvedValue({
        collection_id: 'collection-1',
        content_id: 'content-1',
        position: 1,
        note: 'First item',
        created_at: new Date().toISOString()
      });

      const res = await request(app).get('/collectionItems/collection/collection-1/content/content-1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('content_id', 'content-1');
    });

    it('should return 404 when collection item does not exist', async () => {
      mockFindByKeys.mockResolvedValue(null);

      const res = await request(app).get('/collectionItems/collection/collection-1/content/missing-content');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Collection item not found');
    });
  });

  describe('POST /collectionItems', () => {
    it('should create a collection item and return 201', async () => {
      mockCreate.mockResolvedValue({
        collection_id: 'collection-1',
        content_id: 'content-1',
        position: 2,
        note: 'Added item',
        created_at: new Date().toISOString()
      });

      const res = await request(app).
      post('/collectionItems').
      send({ collection_id: 'collection-1', content_id: 'content-1', position: 2, note: 'Added item' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('content_id', 'content-1');
    });

    it('should return 400 when payload is incomplete', async () => {
      const res = await request(app).
      post('/collectionItems').
      send({ content_id: 'content-1' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'collection_id and content_id are required');
    });
  });

  describe('PUT /collectionItems/collection/:collectionId/content/:contentId', () => {
    it('should update a collection item and return 200', async () => {
      mockUpdateByKeys.mockResolvedValue({
        collection_id: 'collection-1',
        content_id: 'content-1',
        position: 3,
        note: 'Updated note',
        created_at: new Date().toISOString()
      });

      const res = await request(app).
      put('/collectionItems/collection/collection-1/content/content-1').
      send({ position: 3, note: 'Updated note' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('position', 3);
    });

    it('should return 404 when updating unknown collection item', async () => {
      mockUpdateByKeys.mockResolvedValue(null);

      const res = await request(app).
      put('/collectionItems/collection/collection-1/content/missing-content').
      send({ position: 3 });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Collection item not found');
    });
  });

  describe('DELETE /collectionItems/collection/:collectionId/content/:contentId', () => {
    it('should delete a collection item and return 200', async () => {
      mockDeleteByKeys.mockResolvedValue({
        collection_id: 'collection-1',
        content_id: 'content-1',
        position: 1,
        note: 'To delete',
        created_at: new Date().toISOString()
      });

      const res = await request(app).delete('/collectionItems/collection/collection-1/content/content-1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('content_id', 'content-1');
    });

    it('should return 404 when deleting unknown collection item', async () => {
      mockDeleteByKeys.mockResolvedValue(null);

      const res = await request(app).delete('/collectionItems/collection/collection-1/content/missing-content');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Collection item not found');
    });
  });
});