import request from 'supertest';
import { createApp } from '../../app';
import { UserRelationService } from '../../services/userRelationService';
import { User } from '../../interfaces/userInterface';

jest.mock('../../middlewares/auth.middleware', () => ({
  authMiddleware: jest.fn((req, res, next) => {
    req.user = { id: 'user-id-1', email: 'test@test.com' };
    next();
  })
}));

jest.mock('../../services/userRelationService');

const app = createApp();

describe('User Relation Routes with Mocks', () => {
  let mockFollow: jest.Mock;
  let mockUnfollow: jest.Mock;
  let mockAcceptRequest: jest.Mock;
  let mockRefuseRequest: jest.Mock;
  let mockBlockUser: jest.Mock;
  let mockGetFriends: jest.Mock;
  let mockGetPendingRequests: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockFollow = jest.fn();
    mockUnfollow = jest.fn();
    mockAcceptRequest = jest.fn();
    mockRefuseRequest = jest.fn();

    mockBlockUser = jest.fn();
    mockGetFriends = jest.fn();
    mockGetPendingRequests = jest.fn();

    UserRelationService.prototype.follow = mockFollow;
    UserRelationService.prototype.unfollow = mockUnfollow;
    UserRelationService.prototype.accept = mockAcceptRequest;
    UserRelationService.prototype.refuse = mockRefuseRequest;
    UserRelationService.prototype.block = mockBlockUser;
    UserRelationService.prototype.getFriends = mockGetFriends;
    UserRelationService.prototype.getPendingRequests = mockGetPendingRequests;
  });

  describe('POST /userRelation/follow/:followedId', () => {
    it('should call the follow service method and return 201', async () => {
      const followedId = 'user-id-2';
      const followerId = 'user-id-1';
      mockFollow.mockResolvedValue({ message: 'Vous suivez maintenant cet utilisateur.', status: 201 });

      const res = await request(app).
      post(`/userRelation/follow/${followedId}`);

      expect(res.status).toBe(201);
    });
  });

  describe('DELETE /userRelation/unfollow/:followedId', () => {
    it('should call the unfollow service method and return 200', async () => {
      const followedId = 'user-id-2';
      mockUnfollow.mockResolvedValue({ message: 'Vous ne suivez plus cet utilisateur.', status: 200 });

      const res = await request(app).
      delete(`/userRelation/unfollow/${followedId}`);

      expect(res.status).toBe(200);
    });
  });

  describe('POST /userRelation/accept/:followerId', () => {
    it('should call the acceptRequest service method and return 200', async () => {
      const followerId = 'user-id-1';
      mockAcceptRequest.mockResolvedValue({ message: 'Demande d\'ami acceptée.', status: 200 });

      const res = await request(app).
      patch(`/userRelation/accept/${followerId}`);

      expect(res.status).toBe(200);
    });
  });

  describe('POST /userRelation/refuse/:followerId', () => {
    it('should call the refuseRequest service method and return 200', async () => {
      const followerId = 'user-id-1';
      mockRefuseRequest.mockResolvedValue({ message: 'Demande d\'ami refusée.', status: 200 });

      const res = await request(app).
      patch(`/userRelation/refuse/${followerId}`);

      expect(res.status).toBe(200);
    });
  });

  describe('POST /userRelation/block/:blockedId', () => {
    it('should call the blockUser service method and return 200', async () => {
      const blockedId = 'user-id-2';
      mockBlockUser.mockResolvedValue({ message: 'Utilisateur bloqué.', status: 200 });

      const res = await request(app).
      post(`/userRelation/block/${blockedId}`);

      expect(res.status).toBe(200);
    });
  });

  describe('GET /userRelation/friends/:userId', () => {
    it('should call the getFriends service method and return a list of friends', async () => {
      const userId = 'user-id-1';
      const friends: Partial<User>[] = [{ id: 'user-id-2', username: 'friend1' }];
      mockGetFriends.mockResolvedValue(friends);

      const res = await request(app).
      get(`/userRelation/friends/${userId}`);

      expect(res.status).toBe(200);
    });
  });

  describe('GET /userRelation/pending', () => {
    it('should call the getPendingRequests service method and return pending requests', async () => {
      const pendingRequests = [{ follower_id: 'user-id-2', followed_id: 'user-id-1', status: 'pending' }];
      mockGetPendingRequests.mockResolvedValue(pendingRequests);

      const res = await request(app).
      get('/userRelation/request');

      expect(res.status).toBe(200);
    });
  });
});