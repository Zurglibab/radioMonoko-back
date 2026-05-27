import request from 'supertest';
import { createApp } from '../../app';
import { cleanupDatabase, closeDatabaseConnection } from '../test-helpers';
import { pool, initializeDatabase } from '../../database/db';

const app = createApp();

describe('User Routes - Integration Tests', () => {

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

  describe('POST /user/register', () => {
    it('devrait créer un nouvel utilisateur dans la BDD et retourner un token', async () => {
      const userData = { email: 'integration@test.com', password: 'password123', username: 'testuser', privacy: 'public' };

      const response = await request(app).
      post('/user/register').
      send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');

      const dbResult = await pool.query('SELECT email, password FROM users WHERE email = $1', [userData.email]);
      expect(dbResult.rowCount).toBe(1);
      expect(dbResult.rows[0].email).toBe(userData.email);
      expect(dbResult.rows[0].password).not.toBe(userData.password);
    });

    it('devrait retourner une erreur si l\'email existe déjà', async () => {
      const userData = { email: 'duplicate@test.com', password: 'password123', username: 'dupuser' };

      await request(app).
      post('/user/register').
      send(userData);

      const response = await request(app).
      post('/user/register').
      send(userData);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /user/login', () => {
    it('devrait retourner un token si les identifiants sont corrects', async () => {
      const userData = { email: 'login@test.com', password: 'password123', username: 'loginuser' };

      await request(app).
      post('/user/register').
      send(userData);

      const response = await request(app).
      post('/user/login').
      send({ email: userData.email, password: userData.password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('devrait retourner une erreur si le mot de passe est incorrect', async () => {
      const userData = { email: 'login-fail@test.com', password: 'password123', username: 'loginfail' };

      await request(app).
      post('/user/register').
      send(userData);

      const response = await request(app).
      post('/user/login').
      send({ email: userData.email, password: 'wrongpassword' });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /user/me', () => {
    it('devrait retourner les informations de l\'utilisateur connecté', async () => {
      const userData = { email: 'me@test.com', password: 'password123', username: 'meuser' };
      const registerRes = await request(app).post('/user/register').send(userData);
      const token = registerRes.body.token;

      const response = await request(app).
      get('/user/me').
      set('Authorization', `Bearer ${token}`);
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', userData.email);
      expect(response.body).toHaveProperty('username', userData.username);
      expect(response.body).not.toHaveProperty('password');
    });

    it('devrait retourner 401 si aucun token n\'est fourni', async () => {
      const response = await request(app).get('/user/me');
      expect(response.status).toBe(401);
    });
  });

  describe('PUT /user/me', () => {
    it('devrait mettre à jour les informations de l\'utilisateur sauf le mot de passe', async () => {
      const userData = { email: 'updateme@test.com', password: 'password123', username: 'updateuser' };
      const registerRes = await request(app).post('/user/register').send(userData);
      const token = registerRes.body.token;

      const updateData = { display_name: 'Super Update', bio: 'My new bio' };

      const response = await request(app).
      put('/user/me').
      set('Authorization', `Bearer ${token}`).
      send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('display_name', 'Super Update');
      expect(response.body).toHaveProperty('bio', 'My new bio');
      expect(response.body).not.toHaveProperty('password');
    });

    it('devrait renvoyer 403 si l\'on essaie de modifier le mot de passe', async () => {
      const userData = { email: 'updatepass@test.com', password: 'password123', username: 'passuser' };
      const registerRes = await request(app).post('/user/register').send(userData);
      const token = registerRes.body.token;

      const response = await request(app).
      put('/user/me').
      set('Authorization', `Bearer ${token}`).
      send({ password: 'newpassword' });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Modification du mot de passe non autorisée via cette route');
    });
  });

  describe('GET /user/search', () => {
    it('devrait retourner les utilisateurs publics correspondants', async () => {
      const userData1 = { email: 'search1@test.com', password: 'password123', username: 'publicuser1', privacy: 'public' };
      const userData2 = { email: 'search2@test.com', password: 'password123', username: 'publicuser2', privacy: 'public' };

      const registerRes = await request(app).post('/user/register').send(userData1);
      const token = registerRes.body.token;
      await request(app).post('/user/register').send(userData2);

      const response = await request(app).
      get('/user/search?q=publicuser').
      set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body.some((u: any) => u.username === 'publicuser1')).toBe(true);
      expect(response.body.some((u: any) => u.username === 'publicuser2')).toBe(true);
    });

    it('devrait retourner 400 si q n\'est pas fourni', async () => {
      const userData = { email: 'noq@test.com', password: 'password123', username: 'noq' };
      const registerRes = await request(app).post('/user/register').send(userData);
      const token = registerRes.body.token;

      const response = await request(app).
      get('/user/search').
      set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /user/id/:id', () => {
    it('devrait retourner les informations de l\'utilisateur par id', async () => {
      const userData = { email: 'getbyid@test.com', password: 'password123', username: 'getbyiduser' };
      const registerRes = await request(app).post('/user/register').send(userData);
      const token = registerRes.body.token;

      const userRes = await request(app).
      get('/user/me').
      set('Authorization', `Bearer ${token}`);
      const userId = userRes.body.id;

      const response = await request(app).
      get(`/user/id/${userId}`).
      set('Authorization', `Bearer ${token}`);

      console.log(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('email', userData.email);
    });

    it('devrait retourner 404 si l\'id n\'existe pas', async () => {
      const userData = { email: 'auth2@test.com', password: 'password123', username: 'authuser2' };
      const registerRes = await request(app).post('/user/register').send(userData);
      const token = registerRes.body.token;

      const nonexistentId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app).
      get(`/user/id/${nonexistentId}`).
      set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /user/delete/:id', () => {
    it('devrait supprimer l\'utilisateur', async () => {
      const userData = { email: 'todelete@test.com', password: 'password123', username: 'todelete' };
      const registerRes = await request(app).post('/user/register').send(userData);
      const token = registerRes.body.token;

      const userRes = await request(app).
      get('/user/me').
      set('Authorization', `Bearer ${token}`);
      const userId = userRes.body.id;

      const response = await request(app).
      delete(`/user/delete/${userId}`).
      set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', userId);

      const getRes = await request(app).
      get(`/user/id/${userId}`).
      set('Authorization', `Bearer ${token}`);
      expect(getRes.status).toBe(401);
    });

    it('devrait retourner 404 si on essaie de supprimer un id inexistant', async () => {
      const userData = { email: 'auth3@test.com', password: 'password123', username: 'authuser3' };
      const registerRes = await request(app).post('/user/register').send(userData);
      const token = registerRes.body.token;

      const nonexistentId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app).
      delete(`/user/delete/${nonexistentId}`).
      set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('Banned user behavior', () => {
    it('ne devrait plus pouvoir se connecter ni utiliser un token existant après bannissement', async () => {
      const userData = { email: 'banme@test.com', password: 'password123', username: 'banme' };

      const registerRes = await request(app).post('/user/register').send(userData);
      expect(registerRes.status).toBe(201);
      const token = registerRes.body.token;


      const meRes = await request(app).get('/user/me').set('Authorization', `Bearer ${token}`);
      expect(meRes.status).toBe(200);


      const userId = meRes.body.id as string;
      await pool.query('UPDATE users SET is_banned = true WHERE id = $1', [userId]);


      const meAfterBan = await request(app).get('/user/me').set('Authorization', `Bearer ${token}`);
      expect(meAfterBan.status).toBe(403);


      const loginRes = await request(app).post('/user/login').send({ email: userData.email, password: userData.password });
      expect(loginRes.status).toBe(401);
    });
  });
});