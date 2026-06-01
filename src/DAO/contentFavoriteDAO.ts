import { pool } from '../database/db';
import { ContentFavoriteRepository } from '../repository/contentFavoriteRepository';
import { ContentFavorite } from '../interfaces/contentFavoriteInterface';
import { CreateContentFavoriteDTO } from '../DTO/contentFavoriteDTO';
import { PaginationOptions } from '../utils/pagination';

export class ContentFavoriteDAO implements ContentFavoriteRepository {
  async findByKeys(contentId: string, userId: string): Promise<ContentFavorite | null> {
    const result = await pool.query(
      'SELECT content_id, user_id, created_at FROM content_favorites WHERE content_id = $1 AND user_id = $2',
      [contentId, userId]
    );
    return result.rows[0] || null;
  }

  async findByUserId(userId: string, pagination?: PaginationOptions): Promise<ContentFavorite[]> {
    const query = pagination
      ? 'SELECT content_id, user_id, created_at FROM content_favorites WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3'
      : 'SELECT content_id, user_id, created_at FROM content_favorites WHERE user_id = $1 ORDER BY created_at DESC';
    const params = pagination ? [userId, pagination.limit, pagination.offset] : [userId];
    const result = await pool.query(query, params);
    return result.rows;
  }

  async create(favorite: CreateContentFavoriteDTO): Promise<ContentFavorite> {
    const result = await pool.query(
      'INSERT INTO content_favorites (content_id, user_id) VALUES ($1, $2) RETURNING content_id, user_id, created_at',
      [favorite.content_id, favorite.user_id]
    );
    return result.rows[0];
  }

  async deleteByKeys(contentId: string, userId: string): Promise<ContentFavorite | null> {
    const result = await pool.query(
      'DELETE FROM content_favorites WHERE content_id = $1 AND user_id = $2 RETURNING content_id, user_id, created_at',
      [contentId, userId]
    );
    return result.rowCount ? result.rows[0] : null;
  }
}

