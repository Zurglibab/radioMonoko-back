import { pool } from "../database/db";
import { Collection } from "../interfaces/collectionsInterface";
import { CollectionsRepository } from "../repository/collectionsRepository";
import { CreateCollectionDTO, UpdateCollectionDTO } from "../DTO/collectionsDTO";

type CollectionCreateInput = CreateCollectionDTO;
type CollectionUpdateInput = Partial<CollectionCreateInput>;

export class CollectionDAO implements CollectionsRepository {
    async findAll(): Promise<Collection[]> {
        const result = await pool.query("SELECT * FROM collections ORDER BY id ASC");
        return result.rows as Collection[];
    }

    async findById(id: string): Promise<Collection | null> {
        const result = await pool.query("SELECT * FROM collections WHERE id = $1", [id]);
        return (result.rows[0] as Collection) || null;
    }

    async create(data: CollectionCreateInput): Promise<Collection> {
        const { user_id, name, description, is_public } = data;

        const result = await pool.query(
            `
            INSERT INTO collections (id, user_id, name, description, is_public)
            VALUES (gen_random_uuid(), $1, $2, $3, $4)
            RETURNING *
            `,
            [user_id, name, description, is_public ?? true]
        );

        return result.rows[0] as Collection;
    }

    async update(id: string, data: CollectionUpdateInput): Promise<Collection | null> {
        const current = await this.findById(id);
        if (!current) return null;

        const user_id = data.user_id ?? current.user_id;
        const name = data.name ?? current.name;
        const description = data.description ?? current.description;
        const is_public = data.is_public ?? current.is_public;

        const result = await pool.query(
            `
            UPDATE collections
            SET user_id = $1, name = $2, description = $3, is_public = $4
            WHERE id = $5
            RETURNING *
            `,
            [user_id, name, description, is_public, id]
        );

        return (result.rows[0] as Collection) || null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await pool.query("DELETE FROM collections WHERE id = $1", [id]);
        return (result.rowCount ?? 0) > 0;
    }

    async updateById(id: string, collection: UpdateCollectionDTO): Promise<Collection | null> {
        return this.update(id, collection);
    }

    async deleteById(id: string): Promise<Collection | null> {
        const current = await this.findById(id);
        if (!current) return null;

        const deleted = await this.delete(id);
        return deleted ? current : null;
    }

    async findByUserId(userId: string): Promise<Collection[]> {
        const result = await pool.query("SELECT * FROM collections WHERE user_id = $1 ORDER BY id ASC", [userId]);
        return result.rows as Collection[];
    }
}