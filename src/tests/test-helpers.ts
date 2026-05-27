import request from 'supertest';
import { createApp } from '../app';
import { pool, initializeDatabase } from '../database/db';
import bcrypt from 'bcryptjs';

const app = createApp();

let authToken: string;
let dbInitialized = false;


const ensureDbInitialized = async () => {
  if (dbInitialized) return;
  try {
    await initializeDatabase();
    dbInitialized = true;
  } catch (err) {
    console.error('Failed to initialize database for tests:', err);
    throw err;
  }
};

export const getAuthToken = async (): Promise<string> => {
  if (authToken) {
    return authToken;
  }

  await ensureDbInitialized();

  await pool.query('DELETE FROM users');

  const hashedPassword = await bcrypt.hash('password123', 10);
  await pool.query(
    'INSERT INTO users (id, username, email, password, privacy) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
    ['test-user-id', 'testuser', 'test@test.com', hashedPassword, 'public']
  );

  const response = await request(app).
  post('/user/login').
  send({ email: 'test@test.com', password: 'password123' });

  if (response.status !== 200 || !response.body.token) {
    throw new Error('Failed to log in and get auth token for tests.');
  }

  authToken = response.body.token;
  return authToken;
};

export const cleanupDatabase = async () => {
  await ensureDbInitialized();
  await pool.query('DELETE FROM like_review');
  await pool.query('DELETE FROM reviews');
  await pool.query('DELETE FROM collection_items');
  await pool.query('DELETE FROM collections');
  await pool.query('DELETE FROM rating_content');
  await pool.query('DELETE FROM notifications');
  await pool.query('DELETE FROM report_users');
  await pool.query('DELETE FROM user_relations');
  await pool.query('DELETE FROM users');
  await pool.query('DELETE FROM content');
};

export const closeDatabaseConnection = async () => {
  await pool.end();
};