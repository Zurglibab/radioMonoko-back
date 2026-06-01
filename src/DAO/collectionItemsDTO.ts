import { pool } from '../database/db';
import { CollectionItemsRepository } from '../repository/collectionItemsRepository';
import { CollectionItem } from '../interfaces/collectionItemsInterface';
import { CreateCollectionItemDTO, UpdateCollectionItemDTO } from '../DTO/collectionItemsDTO';
import { PaginationOptions } from '../utils/pagination';

export class CollectionItemsDTO implements CollectionItemsRepository {
  async findAll(pagination?: PaginationOptions): Promise<CollectionItem[]> {
    const query = pagination
      ? 'SELECT collection_id, content_id, position, note, created_at FROM collection_items ORDER BY created_at DESC LIMIT $1 OFFSET $2'
      : 'SELECT collection_id, content_id, position, note, created_at FROM collection_items ORDER BY created_at DESC';
    const params = pagination ? [pagination.limit, pagination.offset] : [];
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findByCollectionId(collectionId: string, pagination?: PaginationOptions): Promise<CollectionItem[]> {
    const query = pagination
      ? 'SELECT collection_id, content_id, position, note, created_at FROM collection_items WHERE collection_id = $1 ORDER BY position ASC, created_at ASC LIMIT $2 OFFSET $3'
      : 'SELECT collection_id, content_id, position, note, created_at FROM collection_items WHERE collection_id = $1 ORDER BY position ASC, created_at ASC';
    const params = pagination ? [collectionId, pagination.limit, pagination.offset] : [collectionId];
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findByKeys(collectionId: string, contentId: string): Promise<CollectionItem | null> {
    const result = await pool.query(
      'SELECT collection_id, content_id, position, note, created_at FROM collection_items WHERE collection_id = $1 AND content_id = $2',
      [collectionId, contentId]
    );
    return result.rows[0] || null;
  }

  async create(item: CreateCollectionItemDTO): Promise<CollectionItem> {
    const result = await pool.query(
      'INSERT INTO collection_items (collection_id, content_id, position, note) VALUES ($1, $2, $3, $4) RETURNING collection_id, content_id, position, note, created_at',
      [item.collection_id, item.content_id, item.position ?? 0, item.note ?? null]
    );
    return result.rows[0];
  }

  async updateByKeys(collectionId: string, contentId: string, item: UpdateCollectionItemDTO): Promise<CollectionItem | null> {
    const existing = await this.findByKeys(collectionId, contentId);
    if (!existing) {
      return null;
    }

    const result = await pool.query(
      'UPDATE collection_items SET position = $1, note = $2 WHERE collection_id = $3 AND content_id = $4 RETURNING collection_id, content_id, position, note, created_at',
      [item.position ?? existing.position, item.note ?? existing.note ?? null, collectionId, contentId]
    );
    return result.rows[0] || null;
  }

  async deleteByKeys(collectionId: string, contentId: string): Promise<CollectionItem | null> {
    const result = await pool.query(
      'DELETE FROM collection_items WHERE collection_id = $1 AND content_id = $2 RETURNING collection_id, content_id, position, note, created_at',
      [collectionId, contentId]
    );
    return result.rowCount ? result.rows[0] : null;
  }
}