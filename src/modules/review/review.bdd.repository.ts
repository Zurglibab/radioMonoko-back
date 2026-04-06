import { pool } from '../../database/db';
import { ReviewRepository } from './review.repository';
import { Review } from './review.types';
import { CreateReviewDTO, UpdateReviewDTO } from './review.dto';

export class ReviewBDDRepository implements ReviewRepository {
    async findAll(): Promise<Review[]> {
        const result = await pool.query(
            'SELECT id, user_id, content_id, comment, created_at FROM reviews ORDER BY created_at DESC'
        );
        return result.rows;
    }

    async findById(id: string): Promise<Review | null> {
        const result = await pool.query(
            'SELECT id, user_id, content_id, comment, created_at FROM reviews WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    async findByContentId(contentId: string): Promise<Review[]> {
        const result = await pool.query(
            'SELECT id, user_id, content_id, comment, created_at FROM reviews WHERE content_id = $1 ORDER BY created_at DESC',
            [contentId]
        );
        return result.rows;
    }

    async create(review: CreateReviewDTO): Promise<Review> {
        const result = await pool.query(
            'INSERT INTO reviews (id, user_id, content_id, comment) VALUES ($1, $2, $3, $4) RETURNING id, user_id, content_id, comment, created_at',
            [review.id, review.user_id, review.content_id, review.comment ?? null]
        );
        return result.rows[0];
    }

    async updateById(id: string, review: UpdateReviewDTO): Promise<Review | null> {
        const existing = await this.findById(id);
        if (!existing) {
            return null;
        }

        const result = await pool.query(
            'UPDATE reviews SET comment = $1 WHERE id = $2 RETURNING id, user_id, content_id, comment, created_at',
            [review.comment ?? existing.comment ?? null, id]
        );

        return result.rows[0] || null;
    }

    async deleteById(id: string): Promise<Review | null> {
        const result = await pool.query(
            'DELETE FROM reviews WHERE id = $1 RETURNING id, user_id, content_id, comment, created_at',
            [id]
        );
        return result.rowCount ? result.rows[0] : null;
    }
}

