import {pool} from '../../database/db';
import { User } from './user.types';
import {CreateUserDTO, ModifyUserDTO} from "./user.dto";

export class userBDDRepository {
    async findByEmail(email: string) {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    }
    async findById(id: string) {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
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
}
