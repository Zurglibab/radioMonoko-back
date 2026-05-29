import request from 'supertest';
import express from 'express';
import { createLikeReviewRouter } from '../../routes/likeReviewRoutes';

jest.mock('../../middlewares/auth.middleware', () => ({
  authMiddleware: jest.fn((req, res, next) => {
    req.user = { id: 'user-1', email: 'test@test.com' };
    req.userId = 'user-1';
    next();
  })
}));

jest.mock('../../DAO/likeReviewDAO', () => {
  const LikeReviewDAO = jest.fn().mockImplementation(() => ({
    upsert: jest.fn(async (dto: any) => ({
      review_id: dto.review_id,
      user_id: dto.user_id,
      is_like: dto.is_like,
      created_at: new Date('2026-01-01T00:00:00.000Z')
    })),
    deleteByReviewIdAndUserId: jest.fn(async (reviewId: string, userId: string) => {
      if (reviewId === 'missing') {
        return null;
      }
      return {
        review_id: reviewId,
        user_id: userId,
        is_like: true,
        created_at: new Date('2026-01-01T00:00:00.000Z')
      };
    }),
    findByReviewId: jest.fn(async (reviewId: string) => [
      {
        review_id: reviewId,
        user_id: 'user-1',
        is_like: true,
        created_at: new Date('2026-01-01T00:00:00.000Z')
      }
    ]),
    countByReviewId: jest.fn(async () => ({ likes: 1, dislikes: 0, total: 1 }))
  }));

  return { LikeReviewDAO };
});

describe('LikeReview routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/review', createLikeReviewRouter());

  it('POST /review/:reviewId/likes should upsert like/dislike', async () => {
    const response = await request(app).
    post('/review/review-1/likes').
    send({ user_id: 'user-1', is_like: true });

    expect(response.status).toBe(201);
    expect(response.body.review_id).toBe('review-1');
    expect(response.body.user_id).toBe('user-1');
    expect(response.body.is_like).toBe(true);
  });

  it('GET /review/:reviewId/likes should return likes list', async () => {
    const response = await request(app).get('/review/review-1/likes');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].review_id).toBe('review-1');
  });

  it('GET /review/:reviewId/likes/count should return count', async () => {
    const response = await request(app).get('/review/review-1/likes/count');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ likes: 1, dislikes: 0, total: 1 });
  });

  it('DELETE /review/:reviewId/likes should delete like/dislike', async () => {
    const response = await request(app).
    delete('/review/review-1/likes').
    send({ user_id: 'user-1' });

    expect(response.status).toBe(200);
    expect(response.body.review_id).toBe('review-1');
  });

  it('DELETE /review/:reviewId/likes should return 404 when not found', async () => {
    const response = await request(app).
    delete('/review/missing/likes').
    send({ user_id: 'user-1' });

    expect(response.status).toBe(404);
  });
});