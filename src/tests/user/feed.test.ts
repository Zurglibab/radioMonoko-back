import request from 'supertest';
import { createApp } from '../../app';
import { cleanupDatabase, closeDatabaseConnection } from '../test-helpers';
import { initializeDatabase, pool } from '../../database/db';
const app = createApp();
const viewer = { email: 'feed-viewer@test.com', password: 'password123', username: 'feedviewer' };
const followed = { email: 'feed-followed@test.com', password: 'password123', username: 'feedfollowed' };
const content1Id = '11111111-1111-1111-1111-111111111111';
const content2Id = '22222222-2222-2222-2222-222222222222';
const content3Id = '33333333-3333-3333-3333-333333333333';
const collectionId = '44444444-4444-4444-4444-444444444444';
const reviewId = '55555555-5555-5555-5555-555555555555';

const createContent = async (id: string, apiId: string, title: string) => {
  await pool.query(
    'INSERT INTO content (id, api_id, title, description, content_type) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
    [id, apiId, title, `${title} description`, 'article']
  );
};
async function registerUser(user: {email: string;password: string;username: string;}) {
  const res = await request(app).post('/user/register').send(user);
  expect(res.status).toBe(201);
  return {
    token: res.body.token as string
  };
}
describe('User feed API', () => {
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
  it('retourne les activités récentes des utilisateurs suivis, triées par date décroissante', async () => {
    const viewerAuth = await registerUser(viewer);
    const followedAuth = await registerUser(followed);
    const viewerMe = await request(app).get('/user/me').set('Authorization', `Bearer ${viewerAuth.token}`);
    const followedMe = await request(app).get('/user/me').set('Authorization', `Bearer ${followedAuth.token}`);
    const viewerId = viewerMe.body.id as string;
    const followedId = followedMe.body.id as string;
    await pool.query(
      'INSERT INTO user_relations (followed_id, follower_id, status) VALUES ($1, $2, $3)',
      [followedId, viewerId, 'accepted']
    );
    await pool.query(
      'INSERT INTO content (id, api_id, title, description, content_type) VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10), ($11, $12, $13, $14, $15)',
      [
      content1Id, 'feed-content-1', 'Content 1', 'desc 1', 'article',
      content2Id, 'feed-content-2', 'Content 2', 'desc 2', 'article',
      content3Id, 'feed-content-3', 'Content 3', 'desc 3', 'article']

    );
    await pool.query(
      'INSERT INTO collections (id, user_id, name, description, is_public) VALUES ($1, $2, $3, $4, $5)',
      [collectionId, followedId, 'Followed collection', 'A collection to test feed', true]
    );
    await pool.query(
      'INSERT INTO reviews (id, user_id, content_id, parent_review_id, comment, is_featured, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [reviewId, viewerId, content2Id, null, 'Très bon contenu', false, '2024-01-01T10:00:00.000Z']
    );
    await pool.query(
      'INSERT INTO collection_items (collection_id, content_id, position, note, created_at) VALUES ($1, $2, $3, $4, $5)',
      [collectionId, content1Id, 1, 'Ajouté dans la collection', '2024-01-01T09:00:00.000Z']
    );
    await pool.query(
      'INSERT INTO like_review (review_id, user_id, is_like, created_at) VALUES ($1, $2, $3, $4)',
      [reviewId, followedId, true, '2024-01-01T11:00:00.000Z']
    );
    await pool.query(
      'INSERT INTO reviews (id, user_id, content_id, parent_review_id, comment, is_featured, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      ['66666666-6666-6666-6666-666666666666', followedId, content3Id, null, 'Un commentaire récent', false, '2024-01-01T12:00:00.000Z']
    );
    const res = await request(app).
    get('/user/me/feed?limit=10').
    set('Authorization', `Bearer ${viewerAuth.token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('count', 3);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.map((item: any) => item.type)).toEqual([
    'comment_posted',
    'content_liked',
    'collection_item_added']
    );
    expect(res.body.data[0].actor).toMatchObject({ id: followedId, username: followed.username });
    expect(res.body.data[1].actor).toMatchObject({ id: followedId, username: followed.username });
    expect(res.body.data[2].actor).toMatchObject({ id: followedId, username: followed.username });
    expect(res.body.data[2].collection).toMatchObject({ id: collectionId, name: 'Followed collection' });
  });
  it('retourne un feed vide si l utilisateur ne suit personne', async () => {
    const viewerAuth = await registerUser(viewer);
    const res = await request(app).
    get('/user/me/feed').
    set('Authorization', `Bearer ${viewerAuth.token}`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.data).toEqual([]);
  });

  it('limite le feed à 5 activités maximum par utilisateur suivi', async () => {
    const viewerAuth = await registerUser(viewer);
    const followedAuth = await registerUser(followed);

    const viewerMe = await request(app).get('/user/me').set('Authorization', `Bearer ${viewerAuth.token}`);
    const followedMe = await request(app).get('/user/me').set('Authorization', `Bearer ${followedAuth.token}`);
    const viewerId = viewerMe.body.id as string;
    const followedId = followedMe.body.id as string;

    await pool.query(
      'INSERT INTO user_relations (followed_id, follower_id, status) VALUES ($1, $2, $3)',
      [followedId, viewerId, 'accepted']
    );

    await createContent(content1Id, 'feed-limit-content-1', 'Limit Content');

    for (let i = 0; i < 6; i++) {
      await pool.query(
        'INSERT INTO reviews (id, user_id, content_id, parent_review_id, comment, is_featured, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [
        `66666666-6666-6666-6666-66666666666${i}`,
        followedId,
        content1Id,
        null,
        `Commentaire ${i}`,
        false,
        new Date(2024, 0, 1, 12, i, 0).toISOString()]

      );
    }

    const res = await request(app).
    get('/user/me/feed?limit=250').
    set('Authorization', `Bearer ${viewerAuth.token}`);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(5);
    expect(res.body.data).toHaveLength(5);
    expect(new Set(res.body.data.map((item: any) => item.actor.id))).toEqual(new Set([followedId]));
  });

  it('ne prend que 50 utilisateurs suivis au hasard si l utilisateur en suit davantage', async () => {
    const viewerAuth = await registerUser(viewer);
    const viewerMe = await request(app).get('/user/me').set('Authorization', `Bearer ${viewerAuth.token}`);
    const viewerId = viewerMe.body.id as string;

    await createContent(content2Id, 'feed-many-content', 'Many Content');

    for (let i = 0; i < 51; i++) {
      const followedRes = await request(app).post('/user/register').send({
        email: `followed-${i}@test.com`,
        password: 'password123',
        username: `followed${i}`
      });
      expect(followedRes.status).toBe(201);

      const followedMe = await request(app).get('/user/me').set('Authorization', `Bearer ${followedRes.body.token}`);
      const followedId = followedMe.body.id as string;

      await pool.query(
        'INSERT INTO user_relations (followed_id, follower_id, status) VALUES ($1, $2, $3)',
        [followedId, viewerId, 'accepted']
      );

      await pool.query(
        'INSERT INTO reviews (id, user_id, content_id, parent_review_id, comment, is_featured, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [
        `77777777-7777-7777-7777-7777777777${String(i).padStart(2, '0')}`,
        followedId,
        content2Id,
        null,
        `Commentaire ${i}`,
        false,
        new Date(2024, 0, 2, 0, i, 0).toISOString()]

      );
    }

    const res = await request(app).
    get('/user/me/feed?limit=250').
    set('Authorization', `Bearer ${viewerAuth.token}`);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(50);
    expect(res.body.data).toHaveLength(50);
    expect(new Set(res.body.data.map((item: any) => item.actor.id)).size).toBe(50);
  });
});