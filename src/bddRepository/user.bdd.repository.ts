import { pool } from '../database/db';
import { User } from '../interfaces/userInterface';

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
  async create(user: User): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (id, email, password, username, display_name, avatar, bio, website, privacy, is_banned, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
      user.id,
      user.email,
      user.password,
      user.username ?? null,
      user.display_name ?? null,
      user.avatar ?? null,
      user.bio ?? null,
      user.website ?? null,
      user.privacy ?? 'public',
      user.is_banned ?? false,
      user.created_at ?? new Date(),
      user.updated_at ?? new Date()]

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

  async edit(user: User): Promise<User | null> {
    const result = await pool.query(
      `UPDATE users SET 
                password = COALESCE($1, password), 
                display_name = $2, 
                avatar = $3, 
                bio = $4, 
                website = $5, 
                updated_at = $6
             WHERE id = $7 RETURNING *`,
      [
      user.password ?? null,
      user.display_name ?? null,
      user.avatar ?? null,
      user.bio ?? null,
      user.website ?? null,
      user.updated_at ?? new Date(),
      user.id]

    );
    return result.rows[0] || null;
  }

  async findByIds(ids: string[]) {
    const result = await pool.query(
      'SELECT id, email, username, display_name, avatar, bio, website, privacy, is_banned, created_at, updated_at FROM users WHERE id = ANY($1)',
      [ids]
    );
    return result.rows;
  }

  async searchPublicUsers(query: string) {
    const result = await pool.query(
      `SELECT id, username, display_name, avatar, bio, website, privacy
             FROM users 
             WHERE privacy = 'public' 
             AND (username ILIKE $1 OR display_name ILIKE $1)`,
      [`%${query}%`]
    );
    return result.rows;
  }
}