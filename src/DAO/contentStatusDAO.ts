import { pool } from '../database/db';
import { ContentStatusRepository } from '../repository/contentStatusRepository';
import { ContentStatusRecord } from '../interfaces/contentStatusInterface';
import { UpsertContentStatusDTO } from '../DTO/contentStatusDTO';

export class ContentStatusDAO implements ContentStatusRepository {
  async findByKeys(contentId: string, userId: string): Promise<ContentStatusRecord | null> {
    const result = await pool.query(
      'SELECT content_id, user_id, status, created_at, updated_at FROM content_status WHERE content_id = $1 AND user_id = $2',
      [contentId, userId]
    );
    return result.rows[0] || null;
  }

  async upsert(input: UpsertContentStatusDTO): Promise<ContentStatusRecord> {
    const result = await pool.query(
      `INSERT INTO content_status (content_id, user_id, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (content_id, user_id)
       DO UPDATE SET status = EXCLUDED.status, updated_at = CURRENT_TIMESTAMP
       RETURNING content_id, user_id, status, created_at, updated_at`,
      [input.content_id, input.user_id, input.status]
    );
    return result.rows[0];
  }
}

