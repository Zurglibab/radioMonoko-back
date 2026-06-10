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

jest.mock('../../services/userRelationService', () => {
  return {
    UserRelationService: jest.fn().mockImplementation(() => {
      return {
        follow: jest.fn().mockResolvedValue({ message: 'Vous suivez maintenant cet utilisateur.', status: 201 }),
        unfollow: jest.fn().mockResolvedValue({ message: 'Vous ne suivez plus cet utilisateur.', status: 200 }),
        accept: jest.fn().mockResolvedValue({ message: 'Demande d\'ami acceptée.', status: 200 }),
        refuse: jest.fn().mockResolvedValue({ message: 'Demande d\'ami refusée.', status: 200 }),
        block: jest.fn().mockResolvedValue({ message: 'Utilisateur bloqué.', status: 200 }),
        getFriends: jest.fn().mockResolvedValue([{ id: 'user-id-2', username: 'friend1' }]),
        getFriendsForOther: jest.fn().mockResolvedValue([{ id: 'user-id-2', username: 'friend1' }]),
        getFollowers: jest.fn().mockResolvedValue([]),
        getFollowing: jest.fn().mockResolvedValue([]),
        getPendingRequests: jest.fn().mockResolvedValue([{ follower_id: 'user-id-2', followed_id: 'user-id-1', status: 'pending' }]),
        isFriend: jest.fn().mockResolvedValue(false),
      };
    })
  };
});
const app = createApp();

describe('User Relation Routes with Mocks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /userRelation/follow/:followedId', () => {
    it('should call the follow service method and return 201', async () => {
      const followedId = 'user-id-2';
      const followerId = 'user-id-1';

      const res = await request(app).
        post(`/userRelation/follow/${followedId}`);

      expect(res.status).toBe(201);
    });
  });

  describe('DELETE /userRelation/unfollow/:followedId', () => {
    it('should call the unfollow service method and return 200', async () => {
      const followedId = 'user-id-2';

      const res = await request(app).
        delete(`/userRelation/unfollow/${followedId}`);

      expect(res.status).toBe(200);
    });
  });

  describe('POST /userRelation/accept/:followerId', () => {
    it('should call the acceptRequest service method and return 200', async () => {
      const followerId = 'user-id-1';

      const res = await request(app).
        patch(`/userRelation/accept/${followerId}`);

      expect(res.status).toBe(200);
    });
  });

  describe('POST /userRelation/refuse/:followerId', () => {
    it('should call the refuseRequest service method and return 200', async () => {
      const followerId = 'user-id-1';

      const res = await request(app).
        patch(`/userRelation/refuse/${followerId}`);

      expect(res.status).toBe(200);
    });
  });

  describe('POST /userRelation/block/:blockedId', () => {
    it('should call the blockUser service method and return 200', async () => {
      const blockedId = 'user-id-2';

      const res = await request(app).
        post(`/userRelation/block/${blockedId}`);

      expect(res.status).toBe(200);
    });
  });

  describe('GET /userRelation/friends/:userId', () => {
    it('should call the getFriends service method and return a list of friends', async () => {
      const userId = 'user-id-1';

      const res = await request(app).
        get(`/userRelation/friends/${userId}`);

      expect(res.status).toBe(200);
    });
  });

  describe('GET /userRelation/pending', () => {
    it('should call the getPendingRequests service method and return pending requests', async () => {

      const res = await request(app).
        get('/userRelation/request');

      expect(res.status).toBe(200);
    });
  });

  describe('GET /userRelation/is-friend/:targetId', () => {
    it('should call the isFriend service method and return false if not friends', async () => {
      const targetId = 'user-id-2';

      const res = await request(app).get(`/userRelation/is-friend/${targetId}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ isFriend: false });
    });
  });
});