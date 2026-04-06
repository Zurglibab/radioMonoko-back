import { pool } from '../../database/db';
import { CollectionsRepository } from './collections.repository';
import { Collection } from './collections.types';
import { CreateCollectionDTO, UpdateCollectionDTO } from './collections.dto';

export class CollectionsBDDRepository implements CollectionsRepository {
    async findAll(): Promise<Collection[]> {
        const result = await pool.query(
            'SELECT id, user_id, name, description, is_public, created_at FROM collections ORDER BY created_at DESC'
        );
        return result.rows;
    }

    async findById(id: string): Promise<Collection | null> {
        const result = await pool.query(
            'SELECT id, user_id, name, description, is_public, created_at FROM collections WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    async create(collection: CreateCollectionDTO): Promise<Collection> {
        const result = await pool.query(
            'INSERT INTO collections (id, user_id, name, description, is_public) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, name, description, is_public, created_at',
            [collection.id, collection.user_id, collection.name, collection.description ?? null, collection.is_public ?? true]
        );
        return result.rows[0];
    }

    async updateById(id: string, collection: UpdateCollectionDTO): Promise<Collection | null> {
        const existing = await this.findById(id);
        if (!existing) {
            return null;
        }

        const result = await pool.query(
            'UPDATE collections SET name = $1, description = $2, is_public = $3 WHERE id = $4 RETURNING id, user_id, name, description, is_public, created_at',
            [
                collection.name ?? existing.name,
                collection.description ?? existing.description ?? null,
                collection.is_public ?? existing.is_public,
                id,
            ]
        );

        return result.rows[0] || null;
    }

    async deleteById(id: string): Promise<Collection | null> {
        const result = await pool.query(
            'DELETE FROM collections WHERE id = $1 RETURNING id, user_id, name, description, is_public, created_at',
            [id]
        );
        return result.rowCount ? result.rows[0] : null;
    }

    async findByUserId(userId: string): Promise<Collection[]> {
        const result = await pool.query(
            'SELECT id, user_id, name, description, is_public, created_at FROM collections WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        return result.rows;
    }
}

