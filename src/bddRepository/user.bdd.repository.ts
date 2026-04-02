import {pool} from '../database/db';
import { User } from '../types/user.types';
import {CreateUserDTO, ModifyUserDTO} from "../DTO/user.dto";

export class UserBDDRepository {
    async findByEmail(email: string) {
        const result = await pool.query(
            'SELECT id, email, username, password, display_name, avatar, bio, website, privacy, is_banned, created_at, updated_at FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    }
    async findById(id: string) {
        const result = await pool.query(
            'SELECT id, email, username, display_name, avatar, bio, website, privacy, is_banned, created_at, updated_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }
    async create(user: CreateUserDTO): Promise<User> {
        const result = await pool.query(
            'INSERT INTO users (id, email, password) VALUES ($1, $2, $3) RETURNING *',
            [user.id, user.email, user.password]
        );
        return result.rows[0];
    }

    async deleteById(userId: string): Promise<User | null> {
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING id, email',
            [userId]
        );
        return result.rowCount ? result.rows[0] : null;
    }

    async edit(user: ModifyUserDTO) {
        return null;
    }

    async findByIds(ids: string[]) {
        const result = await pool.query(
            'SELECT id, email, username, display_name, avatar, bio, website, privacy, is_banned, created_at, updated_at FROM users WHERE id = ANY($1)',
            [ids]
        );
        return result.rows;
    }
}
