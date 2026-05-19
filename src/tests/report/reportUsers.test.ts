import request from 'supertest';
import { createApp } from '../../app';
import { cleanupDatabase, closeDatabaseConnection } from '../test-helpers';
import { pool, initializeDatabase } from '../../database/db';

const app = createApp();

describe('Report Users API', () => {
    beforeAll(async () => {
        await initializeDatabase();
    });

    beforeEach(async () => {
        await cleanupDatabase();
    });

    afterAll(async () => {
        await cleanupDatabase();
        await closeDatabaseConnection();
    });

    it('devrait permettre à un utilisateur authentifié de reporter un autre utilisateur', async () => {
        const reporter = { email: 'reporter@test.com', password: 'password123', username: 'reporter' };
        const reported = { email: 'reported@test.com', password: 'password123', username: 'reported' };

        const reg1 = await request(app).post('/user/register').send(reporter);
        expect(reg1.status).toBe(201);
        const token = reg1.body.token;

        const reg2 = await request(app).post('/user/register').send(reported);
        expect(reg2.status).toBe(201);
        const meRes = await request(app).get('/user/me').set('Authorization', `Bearer ${reg2.body.token}`);
        const reportedId = meRes.body.id;

        const body = { reported_user_id: reportedId, report_type: 'spoiler', description: 'Spoiler non marqué' };
        const res = await request(app).post('/reports/users').set('Authorization', `Bearer ${token}`).send(body);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.data).toHaveProperty('id');

        const countRes = await pool.query('SELECT COUNT(*) as c FROM report_users WHERE reported_user_id = $1', [reportedId]);
        expect(Number(countRes.rows[0].c)).toBe(1);
    });

    it('devrait retourner 401 si non authentifié', async () => {
        const res = await request(app).post('/reports/users').send({ reported_user_id: 'some-id', report_type: 'spoiler' });
        expect(res.status).toBe(401);
    });

    it('devrait retourner 400 si champs manquants', async () => {
        const user = { email: 't@test.com', password: 'password123', username: 'tuser' };
        const reg = await request(app).post('/user/register').send(user);
        const token = reg.body.token;

        const res = await request(app).post('/reports/users').set('Authorization', `Bearer ${token}`).send({ reported_user_id: '' });
        expect(res.status).toBe(400);
    });
});

