import request from 'supertest';
import { createApp } from '../app';
import { pool } from '../database/db';
import bcrypt from 'bcryptjs';

const app = createApp();
let authToken: string;

export const getAuthToken = async (): Promise<string> => {
    if (authToken) {
        return authToken;
    }

    await pool.query('DELETE FROM users');

    const hashedPassword = await bcrypt.hash('password123', 10);
    await pool.query(
        'INSERT INTO users (id, username, email, password, privacy) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
        ['test-user-id', 'testuser', 'test@test.com', hashedPassword, 'public']
    );

    const response = await request(app)
        .post('/user/login')
        .send({ email: 'test@test.com', password: 'password123' });

    if (response.status !== 200 || !response.body.token) {
        throw new Error('Failed to log in and get auth token for tests.');
    }

    authToken = response.body.token;
    return authToken;
};

export const cleanupDatabase = async () => {
    await pool.query('DELETE FROM user_relations');
    await pool.query('DELETE FROM users');
};

export const closeDatabaseConnection = async () => {
    await pool.end();
};
