import { pool } from '../database/db';
import { UpsertLikeReviewDTO } from '../DTO/likeReviewDTO';
import { LikeReviewRepository } from '../repository/likeReviewRepository';
import { LikeReview, LikeReviewCount } from '../interfaces/likeReviewInterface';

export class LikeReviewDAO implements LikeReviewRepository {
  async upsert(dto: UpsertLikeReviewDTO): Promise<LikeReview> {
    const result = await pool.query(
      `INSERT INTO like_review (review_id, user_id, is_like)
             VALUES ($1, $2, $3)
             ON CONFLICT (review_id, user_id)
             DO UPDATE SET is_like = EXCLUDED.is_like
             RETURNING review_id, user_id, is_like, created_at`,
      [dto.review_id, dto.user_id, dto.is_like]
    );

    return result.rows[0];
  }

  async deleteByReviewIdAndUserId(reviewId: string, userId: string): Promise<LikeReview | null> {
    const result = await pool.query(
      'DELETE FROM like_review WHERE review_id = $1 AND user_id = $2 RETURNING review_id, user_id, is_like, created_at',
      [reviewId, userId]
    );

    return result.rowCount ? result.rows[0] : null;
  }

  async findByReviewId(reviewId: string): Promise<LikeReview[]> {
    const result = await pool.query(
      'SELECT review_id, user_id, is_like, created_at FROM like_review WHERE review_id = $1 ORDER BY created_at DESC',
      [reviewId]
    );

    return result.rows;
  }

  async countByReviewId(reviewId: string): Promise<LikeReviewCount> {
    const result = await pool.query(
      `SELECT
                COUNT(*) FILTER (WHERE is_like = true)::int AS likes,
                COUNT(*) FILTER (WHERE is_like = false)::int AS dislikes,
                COUNT(*)::int AS total
             FROM like_review
             WHERE review_id = $1`,
      [reviewId]
    );

    return result.rows[0] ?? { likes: 0, dislikes: 0, total: 0 };
  }
}