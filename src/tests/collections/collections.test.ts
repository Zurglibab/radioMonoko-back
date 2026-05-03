import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../app';

const mockFindAll = jest.fn();
const mockFindById = jest.fn();
const mockCreate = jest.fn();
const mockUpdateById = jest.fn();
const mockDeleteById = jest.fn();

jest.mock('../../DAO/collectionDAO', () => ({
    CollectionDAO: jest.fn().mockImplementation(() => ({
        findAll: mockFindAll,
        findById: mockFindById,
        create: mockCreate,
        updateById: mockUpdateById,
        deleteById: mockDeleteById,
        findByUserId: jest.fn().mockResolvedValue([]),
    })),
}));

describe('Collections Routes with Mocks', () => {
    let app: Express;

    beforeEach(() => {
        jest.clearAllMocks();

        app = createApp();
    });

    describe('GET /collections', () => {
        it('should return all collections with status 200', async () => {
            mockFindAll.mockResolvedValue([
                {
                    id: 'collection-1',
                    user_id: 'user-1',
                    name: 'Ma collection',
                    description: 'Description',
                    is_public: true,
                    created_at: new Date().toISOString(),
                },
            ]);

            const res = await request(app).get('/collections');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toHaveProperty('id', 'collection-1');
        });
    });

    describe('GET /collections/:id', () => {
        it('should return one collection with status 200', async () => {
            mockFindById.mockResolvedValue({
                id: 'collection-1',
                user_id: 'user-1',
                name: 'Ma collection',
                description: 'Description',
                is_public: true,
                created_at: new Date().toISOString(),
            });

            const res = await request(app).get('/collections/collection-1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', 'collection-1');
        });

        it('should return 404 when collection does not exist', async () => {
            mockFindById.mockResolvedValue(null);

            const res = await request(app).get('/collections/missing-id');

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Collection not found');
        });
    });

    describe('POST /collections', () => {
        it('should create a collection and return 201', async () => {
            mockCreate.mockResolvedValue({
                id: 'collection-2',
                user_id: 'user-1',
                name: 'Nouvelle collection',
                description: 'Desc',
                is_public: true,
                created_at: new Date().toISOString(),
            });

            const res = await request(app)
                .post('/collections')
                .send({ user_id: 'user-1', name: 'Nouvelle collection', description: 'Desc', is_public: true });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id', 'collection-2');
        });

        it('should return 400 when payload is incomplete', async () => {
            const res = await request(app)
                .post('/collections')
                .send({ name: 'Invalid' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'user_id and name are required');
        });
    });

    describe('PUT /collections/:id', () => {
        it('should update collection and return 200', async () => {
            mockUpdateById.mockResolvedValue({
                id: 'collection-1',
                user_id: 'user-1',
                name: 'Collection modifiée',
                description: 'Modifiée',
                is_public: false,
                created_at: new Date().toISOString(),
            });

            const res = await request(app)
                .put('/collections/collection-1')
                .send({ name: 'Collection modifiée', is_public: false });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'Collection modifiée');
        });

        it('should return 404 when updating unknown collection', async () => {
            mockUpdateById.mockResolvedValue(null);

            const res = await request(app)
                .put('/collections/missing-id')
                .send({ name: 'Collection modifiée' });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Collection not found');
        });
    });

    describe('DELETE /collections/:id', () => {
        it('should delete collection and return 200', async () => {
            mockDeleteById.mockResolvedValue({
                id: 'collection-1',
                user_id: 'user-1',
                name: 'A supprimer',
                description: 'Desc',
                is_public: true,
                created_at: new Date().toISOString(),
            });

            const res = await request(app).delete('/collections/collection-1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', 'collection-1');
        });

        it('should return 404 when deleting unknown collection', async () => {
            mockDeleteById.mockResolvedValue(null);

            const res = await request(app).delete('/collections/missing-id');

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Collection not found');
        });
    });
});

