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

  it('devrait retourner tous les reports de manière paginée et propre à un utilisateur', async () => {
    const reporter = { email: 'rep1@test.com', password: 'password123', username: 'rep1' };
    const reported = { email: 'rep2@test.com', password: 'password123', username: 'rep2' };

    const reg1 = await request(app).post('/user/register').send(reporter);
    const token = reg1.body.token;
    const reg2 = await request(app).post('/user/register').send(reported);
    const meRes = await request(app).get('/user/me').set('Authorization', `Bearer ${reg2.body.token}`);
    const reportedId = meRes.body.id;

    await request(app).post('/reports/users').set('Authorization', `Bearer ${token}`).send({
      reported_user_id: reportedId,
      report_type: 'spam',
      description: 'Spam description 1'
    });
    await request(app).post('/reports/users').set('Authorization', `Bearer ${token}`).send({
      reported_user_id: reportedId,
      report_type: 'harassment',
      description: 'Harassment description 2'
    });

    const res1 = await request(app).get('/reports/users?page=1&limit=1').set('Authorization', `Bearer ${token}`);
    expect(res1.status).toBe(200);
    expect(res1.headers['x-pagination-enabled']).toBe('true');
    expect(res1.headers['x-pagination-page']).toBe('1');
    expect(res1.headers['x-pagination-limit']).toBe('1');
    expect(res1.headers['x-pagination-count']).toBe('1');
    expect(res1.body.success).toBe(true);
    expect(res1.body.data).toHaveLength(1);

    const res2 = await request(app).get(`/reports/users/${reportedId}?page=1&limit=5`).set('Authorization', `Bearer ${token}`);
    expect(res2.status).toBe(200);
    expect(res2.headers['x-pagination-enabled']).toBe('true');
    expect(res2.headers['x-pagination-page']).toBe('1');
    expect(res2.headers['x-pagination-limit']).toBe('5');
    expect(res2.headers['x-pagination-count']).toBe('2');
    expect(res2.body.data).toHaveLength(2);
  });

  it('devrait permettre de supprimer tous les reports d\'un utilisateur', async () => {
    const reporter = { email: 'repdel1@test.com', password: 'password123', username: 'repdel1' };
    const reported = { email: 'repdel2@test.com', password: 'password123', username: 'repdel2' };

    const reg1 = await request(app).post('/user/register').send(reporter);
    const token = reg1.body.token;
    const reg2 = await request(app).post('/user/register').send(reported);
    const meRes = await request(app).get('/user/me').set('Authorization', `Bearer ${reg2.body.token}`);
    const reportedId = meRes.body.id;

    await request(app).post('/reports/users').set('Authorization', `Bearer ${token}`).send({
      reported_user_id: reportedId,
      report_type: 'spam',
      description: 'Spam 1'
    });
    await request(app).post('/reports/users').set('Authorization', `Bearer ${token}`).send({
      reported_user_id: reportedId,
      report_type: 'harassment',
      description: 'Harassment 2'
    });

    const checkCount1 = await pool.query('SELECT COUNT(*) as c FROM report_users WHERE reported_user_id = $1', [reportedId]);
    expect(Number(checkCount1.rows[0].c)).toBe(2);

    const delRes = await request(app).delete(`/reports/users/by-reported-user/${reportedId}`).set('Authorization', `Bearer ${token}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);

    const checkCount2 = await pool.query('SELECT COUNT(*) as c FROM report_users WHERE reported_user_id = $1', [reportedId]);
    expect(Number(checkCount2.rows[0].c)).toBe(0);
  });

  it('devrait permettre de supprimer un seul report par son ID', async () => {
    const reporter = { email: 'repdel3@test.com', password: 'password123', username: 'repdel3' };
    const reported = { email: 'repdel4@test.com', password: 'password123', username: 'repdel4' };

    const reg1 = await request(app).post('/user/register').send(reporter);
    const token = reg1.body.token;
    const reg2 = await request(app).post('/user/register').send(reported);
    const meRes = await request(app).get('/user/me').set('Authorization', `Bearer ${reg2.body.token}`);
    const reportedId = meRes.body.id;

    const repRes = await request(app).post('/reports/users').set('Authorization', `Bearer ${token}`).send({
      reported_user_id: reportedId,
      report_type: 'spam',
      description: 'To delete'
    });
    const reportId = repRes.body.data.id;

    const delRes = await request(app).delete(`/reports/users/${reportId}`).set('Authorization', `Bearer ${token}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);

    const checkCount = await pool.query('SELECT COUNT(*) as c FROM report_users WHERE id = $1', [reportId]);
    expect(Number(checkCount.rows[0].c)).toBe(0);
  });

  it('devrait retourner 404 lors de la suppression d\'un report inexistant', async () => {
    const user = { email: 'repdel5@test.com', password: 'password123', username: 'repdel5' };
    const reg = await request(app).post('/user/register').send(user);
    const token = reg.body.token;
    const fakeUuid = '00000000-0000-0000-0000-000000000000';

    const delRes = await request(app).delete(`/reports/users/${fakeUuid}`).set('Authorization', `Bearer ${token}`);
    expect(delRes.status).toBe(404);
    expect(delRes.body.success).toBe(false);
  });
});