import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../app';
import { NotificationDAO } from '../../DAO/notificationDAO';

jest.mock('../../middlewares/auth.middleware', () => ({
  authMiddleware: jest.fn((req, _res, next) => {
    req.user = { id: 'user-1', email: 'test@test.com' };
    req.userId = 'user-1';
    next();
  })
}));

jest.mock('../../DAO/notificationDAO');

describe('Notification Routes with Mocks', () => {
  let app: Express;
  let mockFindAll: jest.Mock;
  let mockFindById: jest.Mock;
  let mockFindByUserId: jest.Mock;
  let mockFindUnreadByUserId: jest.Mock;
  let mockCreate: jest.Mock;
  let mockUpdateById: jest.Mock;
  let mockMarkAsRead: jest.Mock;
  let mockMarkAllAsReadByUserId: jest.Mock;
  let mockDeleteById: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockFindAll = jest.fn();
    mockFindById = jest.fn();
    mockFindByUserId = jest.fn();
    mockFindUnreadByUserId = jest.fn();
    mockCreate = jest.fn();
    mockUpdateById = jest.fn();
    mockMarkAsRead = jest.fn();
    mockMarkAllAsReadByUserId = jest.fn();
    mockDeleteById = jest.fn();

    NotificationDAO.prototype.findAll = mockFindAll;
    NotificationDAO.prototype.findById = mockFindById;
    NotificationDAO.prototype.findByUserId = mockFindByUserId;
    NotificationDAO.prototype.findUnreadByUserId = mockFindUnreadByUserId;
    NotificationDAO.prototype.create = mockCreate;
    NotificationDAO.prototype.updateById = mockUpdateById;
    NotificationDAO.prototype.markAsRead = mockMarkAsRead;
    NotificationDAO.prototype.markAllAsReadByUserId = mockMarkAllAsReadByUserId;
    NotificationDAO.prototype.deleteById = mockDeleteById;

    app = createApp();
  });

  describe('PATCH /notifications/user/:userId/read-all', () => {
    it('should mark every unread notification of the user as read and return them', async () => {
      mockMarkAllAsReadByUserId.mockResolvedValue([
        {
          id: 'notification-1',
          user_id: 'user-1',
          type: 'like',
          message: 'A liked your review',
          is_read: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'notification-2',
          user_id: 'user-1',
          type: 'comment',
          message: 'A commented your review',
          is_read: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

      const res = await request(app).patch('/notifications/user/user-1/read-all');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('is_read', true);
      expect(mockMarkAllAsReadByUserId).toHaveBeenCalledWith('user-1');
    });
  });

  describe('PATCH /notifications/:id/read', () => {
    it('should mark a single notification as read and return it', async () => {
      mockMarkAsRead.mockResolvedValue({
        id: 'notification-1',
        user_id: 'user-1',
        type: 'like',
        message: 'A liked your review',
        is_read: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      const res = await request(app).patch('/notifications/notification-1/read');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 'notification-1');
      expect(res.body).toHaveProperty('is_read', true);
      expect(mockMarkAsRead).toHaveBeenCalledWith('notification-1');
    });
  });

  describe('GET /notifications (with pagination)', () => {
    it('should return all notifications with pagination headers disabled by default if no query params', async () => {
      mockFindAll.mockResolvedValue([
        { id: 'notification-1', user_id: 'user-1', type: 'like', message: 'Test 1', is_read: false }
      ]);

      const res = await request(app).get('/notifications');

      expect(res.status).toBe(200);
      expect(res.headers['x-pagination-enabled']).toBe('false');
      expect(res.headers['x-pagination-count']).toBe('1');
      expect(mockFindAll).toHaveBeenCalledWith(undefined);
    });

    it('should parse page and limit and pass them to the service', async () => {
      mockFindAll.mockResolvedValue([
        { id: 'notification-1', user_id: 'user-1', type: 'like', message: 'Test 1', is_read: false }
      ]);

      const res = await request(app).get('/notifications?page=2&limit=5');

      expect(res.status).toBe(200);
      expect(res.headers['x-pagination-enabled']).toBe('true');
      expect(res.headers['x-pagination-page']).toBe('2');
      expect(res.headers['x-pagination-limit']).toBe('5');
      expect(res.headers['x-pagination-offset']).toBe('5');
      expect(res.headers['x-pagination-count']).toBe('1');
      expect(mockFindAll).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        offset: 5
      });
    });
  });

  describe('GET /notifications/user/:userId (with pagination)', () => {
    it('should return user notifications and pass parsed pagination options', async () => {
      mockFindByUserId.mockResolvedValue([]);

      const res = await request(app).get('/notifications/user/user-1?page=3&limit=10');

      expect(res.status).toBe(200);
      expect(res.headers['x-pagination-enabled']).toBe('true');
      expect(res.headers['x-pagination-page']).toBe('3');
      expect(res.headers['x-pagination-limit']).toBe('10');
      expect(res.headers['x-pagination-offset']).toBe('20');
      expect(res.headers['x-pagination-count']).toBe('0');
      expect(mockFindByUserId).toHaveBeenCalledWith('user-1', {
        page: 3,
        limit: 10,
        offset: 20
      });
    });
  });
});

