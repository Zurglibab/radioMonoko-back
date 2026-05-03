import {pool} from '../database/db';
import { User } from '../interfaces/userInterface';
import {CreateUserDTO, ModifyUserDTO} from "../DTO/userDTO";

export class UserDAO {
    async findByEmail(email: string) {
        const result = await pool.query(
            'SELECT id, email, username, password, display_name, avatar, bio, website, privacy, is_banned, role, created_at, updated_at FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    }
    async findById(id: string) {
        const result = await pool.query(
            'SELECT id, email, username, display_name, avatar, bio, website, privacy, is_banned, role, created_at, updated_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }
    async create(user: CreateUserDTO): Promise<User> {
        const result = await pool.query(
            'INSERT INTO users (id, email, password, username, display_name, avatar, bio, website, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [user.id, user.email, user.password, user.username || null, user.username || null, user.avatar || null, user.bio || null, user.website || null, user.role || 'user']
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
        const result = await pool.query(
            `UPDATE users SET
                password = COALESCE($2, password),
                display_name = COALESCE($3, display_name),
                avatar = COALESCE($4, avatar),
                bio = COALESCE($5, bio),
                website = COALESCE($6, website),
                is_banned = COALESCE($7, is_banned),
                role = COALESCE($8, role),
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $1 RETURNING id, email, username, display_name, avatar, bio, website, privacy, is_banned, role, created_at, updated_at`,
            [user.id, (user as any).password || null, user.display_name || null, user.avatar || null, user.bio || null, user.website || null, (user as any).is_banned ?? null, (user as any).role || null]
        );
        return result.rowCount ? result.rows[0] : null;
    }

    async findByIds(ids: string[]) {
        const result = await pool.query(
            'SELECT id, email, username, display_name, avatar, bio, website, privacy, is_banned, created_at, updated_at FROM users WHERE id = ANY($1)',
            [ids]
        );
        return result.rows;
    }
}
