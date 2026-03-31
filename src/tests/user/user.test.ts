import request from 'supertest';
import { createApp } from '../../app';
import { cleanupDatabase, closeDatabaseConnection } from '../test-helpers';
import { pool } from '../../database/db';

const app = createApp();

describe('User Routes - Integration Tests', () => {

    beforeEach(async () => {
        await cleanupDatabase();
    });

    afterAll(async () => {
        await cleanupDatabase();
        await closeDatabaseConnection();
    });

    describe('POST /user/register', () => {
        it('devrait créer un nouvel utilisateur dans la BDD et retourner un token', async () => {
            const userData = { email: 'integration@test.com', password: 'password123', username: 'testuser', privacy: 'public' };

            const response = await request(app)
                .post('/user/register')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');

            const dbResult = await pool.query('SELECT email, password FROM users WHERE email = $1', [userData.email]);
            expect(dbResult.rowCount).toBe(1);
            expect(dbResult.rows[0].email).toBe(userData.email);
            expect(dbResult.rows[0].password).not.toBe(userData.password);
        });

        it('devrait retourner une erreur si l\'email existe déjà', async () => {
            const userData = { email: 'duplicate@test.com', password: 'password123', username: 'dupuser' };

            await request(app)
                .post('/user/register')
                .send(userData);

            const response = await request(app)
                .post('/user/register')
                .send(userData);

            expect(response.status).toBe(400);
        });
    });

    describe('POST /user/login', () => {
        it('devrait retourner un token si les identifiants sont corrects', async () => {
            const userData = { email: 'login@test.com', password: 'password123', username: 'loginuser' };

            await request(app)
                .post('/user/register')
                .send(userData);

            const response = await request(app)
                .post('/user/login')
                .send({ email: userData.email, password: userData.password });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        it('devrait retourner une erreur si le mot de passe est incorrect', async () => {
            const userData = { email: 'login-fail@test.com', password: 'password123', username: 'loginfail' };

            await request(app)
                .post('/user/register')
                .send(userData);

            const response = await request(app)
                .post('/user/login')
                .send({ email: userData.email, password: 'wrongpassword' });

            expect(response.status).toBe(401);
        });
    });
});
