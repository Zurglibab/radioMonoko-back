import { pool } from '../database/db';
import { ReviewRepository } from '../repository/reviewRepository';
import { Review } from '../interfaces/reviewInterface';
import { CreateReviewDTO, UpdateReviewDTO } from '../DTO/reviewDTO';
import { PaginationOptions } from '../utils/pagination';

export class ReviewDAO implements ReviewRepository {
  async findAll(pagination?: PaginationOptions): Promise<Review[]> {
    const query = pagination
      ? 'SELECT id, user_id, content_id, parent_review_id, comment, is_featured, created_at FROM reviews ORDER BY created_at DESC LIMIT $1 OFFSET $2'
      : 'SELECT id, user_id, content_id, parent_review_id, comment, is_featured, created_at FROM reviews ORDER BY created_at DESC';
    const params = pagination ? [pagination.limit, pagination.offset] : [];
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id: string): Promise<Review | null> {
    const result = await pool.query(
      'SELECT id, user_id, content_id, parent_review_id, comment, is_featured, created_at FROM reviews WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByContentId(contentId: string, pagination?: PaginationOptions): Promise<Review[]> {
    const query = pagination
      ? 'SELECT id, user_id, content_id, parent_review_id, comment, is_featured, created_at FROM reviews WHERE content_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3'
      : 'SELECT id, user_id, content_id, parent_review_id, comment, is_featured, created_at FROM reviews WHERE content_id = $1 ORDER BY created_at DESC';
    const params = pagination ? [contentId, pagination.limit, pagination.offset] : [contentId];
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findByParentReviewId(parentReviewId: string | null, pagination?: PaginationOptions): Promise<Review[]> {
    const query = pagination
      ? 'SELECT id, user_id, content_id, parent_review_id, comment, is_featured, created_at FROM reviews WHERE parent_review_id IS NOT DISTINCT FROM $1 ORDER BY created_at ASC LIMIT $2 OFFSET $3'
      : 'SELECT id, user_id, content_id, parent_review_id, comment, is_featured, created_at FROM reviews WHERE parent_review_id IS NOT DISTINCT FROM $1 ORDER BY created_at ASC';
    const params = pagination ? [parentReviewId, pagination.limit, pagination.offset] : [parentReviewId];
    const result = await pool.query(query, params);
    return result.rows;
  }

  async create(review: CreateReviewDTO): Promise<Review> {
    const result = await pool.query(
      'INSERT INTO reviews (id, user_id, content_id, parent_review_id, comment, is_featured) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, user_id, content_id, parent_review_id, comment, is_featured, created_at',
      [review.id, review.user_id, review.content_id, review.parent_review_id ?? null, review.comment ?? null, (review as any).is_featured ?? false]
    );
    return result.rows[0];
  }

  async updateById(id: string, review: UpdateReviewDTO): Promise<Review | null> {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }

    const result = await pool.query(
      'UPDATE reviews SET parent_review_id = $1, comment = $2, is_featured = COALESCE($4, is_featured) WHERE id = $3 RETURNING id, user_id, content_id, parent_review_id, comment, is_featured, created_at',
      [review.parent_review_id ?? existing.parent_review_id ?? null, review.comment ?? existing.comment ?? null, id, (review as any).is_featured ?? null]
    );

    return result.rows[0] || null;
  }

  async deleteById(id: string): Promise<Review | null> {
    const result = await pool.query(
      'DELETE FROM reviews WHERE id = $1 RETURNING id, user_id, content_id, parent_review_id, comment, created_at',
      [id]
    );
    return result.rowCount ? result.rows[0] : null;
  }
}