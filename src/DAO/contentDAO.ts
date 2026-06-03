import { pool } from "../database/db";
import { Content } from "../interfaces/contentInterface";
import { ContentRepository } from "../repository/contentRepository";
import { CreateContentDTO, UpdateContentDTO } from "../DTO/contentDTO";
import { PaginationOptions } from "../utils/pagination";

export class ContentDAO implements ContentRepository {
  async findAll(pagination?: PaginationOptions): Promise<Content[]> {
    const query = pagination
      ? "SELECT * FROM content ORDER BY created_at DESC LIMIT $1 OFFSET $2"
      : "SELECT * FROM content ORDER BY created_at DESC";
    const params = pagination ? [pagination.limit, pagination.offset] : [];
    const result = await pool.query(query, params);
    return result.rows as Content[];
  }

  async findById(id: string): Promise<Content | null> {
    const result = await pool.query("SELECT * FROM content WHERE id = $1", [id]);
    return result.rows[0] as Content || null;
  }

  async findByApiId(apiId: string): Promise<Content | null> {
    const result = await pool.query("SELECT * FROM content WHERE api_id = $1", [apiId]);
    return result.rows[0] as Content || null;
  }

  async create(content: CreateContentDTO): Promise<Content> {
    const result = await pool.query(
      `
            INSERT INTO content (id, api_id, title, description, content_type)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
      [content.id, content.api_id, content.title, content.description ?? null, content.content_type]
    );

    return result.rows[0] as Content;
  }

  async updateById(id: string, content: UpdateContentDTO): Promise<Content | null> {
    const current = await this.findById(id);
    if (!current) return null;

    const title = content.title ?? current.title;
    const description = content.description ?? current.description;
    const content_type = content.content_type ?? current.content_type;

    const result = await pool.query(
      `
            UPDATE content
            SET title = $1, description = $2, content_type = $3
            WHERE id = $4
            RETURNING *
            `,
      [title, description ?? null, content_type, id]
    );

    return result.rows[0] as Content || null;
  }

  async deleteById(id: string): Promise<Content | null> {
    const current = await this.findById(id);
    if (!current) return null;

    await pool.query("DELETE FROM content WHERE id = $1", [id]);
    return current;
  }
}