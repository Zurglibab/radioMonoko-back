import { pool } from '../database/db';
import { ContentRepository } from './content.repository';
import { Content } from '../interfaces/contentInterface';
import { CreateContentDTO, UpdateContentDTO } from '../DTO/contentDTO';

export class ContentRepository implements ContentRepository {
    async findAll(): Promise<Content[]> {
        const result = await pool.query(
            'SELECT id, api_id, title, description, content_type, created_at FROM content ORDER BY created_at DESC'
        );
        return result.rows;
    }

    async findById(id: string): Promise<Content | null> {
        const result = await pool.query(
            'SELECT id, api_id, title, description, content_type, created_at FROM content WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    async create(content: CreateContentDTO): Promise<Content> {
        const result = await pool.query(
            'INSERT INTO content (id, api_id, title, description, content_type) VALUES ($1, $2, $3, $4, $5) RETURNING id, api_id, title, description, content_type, created_at',
            [content.id, content.api_id, content.title, content.description || null, content.content_type]
        );
        return result.rows[0];
    }

    async updateById(id: string, content: UpdateContentDTO): Promise<Content | null> {
        const existing = await this.findById(id);
        if (!existing) {
            return null;
        }

        const result = await pool.query(
            'UPDATE content SET title = $1, description = $2, content_type = $3 WHERE id = $4 RETURNING id, api_id, title, description, content_type, created_at',
            [
                content.title ?? existing.title,
                content.description ?? existing.description ?? null,
                content.content_type ?? existing.content_type,
                id,
            ]
        );

        return result.rows[0] || null;
    }

    async deleteById(id: string): Promise<Content | null> {
        const result = await pool.query(
            'DELETE FROM content WHERE id = $1 RETURNING id, api_id, title, description, content_type, created_at',
            [id]
        );
        return result.rowCount ? result.rows[0] : null;
    }
}

