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

  async findLibraryByUserId(userId: string): Promise<any[]> {
    const result = await pool.query(
      `SELECT 
        cs.status,
        cs.created_at as status_created_at,
        cs.updated_at as status_updated_at,
        cs.content_id,
        cs.user_id,
        c.api_id,
        c.title,
        c.description,
        c.content_type,
        c.created_at as content_created_at
       FROM content_status cs
       INNER JOIN content c ON cs.content_id = c.id
       WHERE cs.user_id = $1
       ORDER BY cs.updated_at DESC`,
      [userId]
    );
    
    // Mapper the rows to the requested DTO format
    return result.rows.map(row => ({
      content_id: row.content_id,
      user_id: row.user_id,
      status: row.status,
      created_at: row.status_created_at,
      updated_at: row.status_updated_at,
      content: {
        id: row.content_id,
        api_id: row.api_id,
        title: row.title,
        description: row.description,
        content_type: row.content_type,
        created_at: row.content_created_at
      }
    }));
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

