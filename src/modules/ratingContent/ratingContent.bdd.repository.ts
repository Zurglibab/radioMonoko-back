import { pool } from '../../database/db';
import { RatingContentRepository } from './ratingContent.repository';
import { RatingContent } from './ratingContent.types';
import { CreateRatingContentDTO, UpdateRatingContentDTO } from './ratingContent.dto';

export class RatingContentBDDRepository implements RatingContentRepository {
    async findAll(): Promise<RatingContent[]> {
        const result = await pool.query(
            'SELECT content_id, user_id, average_rating FROM rating_content ORDER BY content_id, user_id'
        );
        return result.rows;
    }

    async findByKeys(contentId: string, userId: string): Promise<RatingContent | null> {
        const result = await pool.query(
            'SELECT content_id, user_id, average_rating FROM rating_content WHERE content_id = $1 AND user_id = $2',
            [contentId, userId]
        );
        return result.rows[0] || null;
    }

    async create(rating: CreateRatingContentDTO): Promise<RatingContent> {
        const result = await pool.query(
            'INSERT INTO rating_content (content_id, user_id, average_rating) VALUES ($1, $2, $3) RETURNING content_id, user_id, average_rating',
            [rating.content_id, rating.user_id, rating.average_rating]
        );
        return result.rows[0];
    }

    async updateByKeys(contentId: string, userId: string, rating: UpdateRatingContentDTO): Promise<RatingContent | null> {
        const result = await pool.query(
            'UPDATE rating_content SET average_rating = $1 WHERE content_id = $2 AND user_id = $3 RETURNING content_id, user_id, average_rating',
            [rating.average_rating, contentId, userId]
        );
        return result.rows[0] || null;
    }

    async deleteByKeys(contentId: string, userId: string): Promise<RatingContent | null> {
        const result = await pool.query(
            'DELETE FROM rating_content WHERE content_id = $1 AND user_id = $2 RETURNING content_id, user_id, average_rating',
            [contentId, userId]
        );
        return result.rowCount ? result.rows[0] : null;
    }
}

