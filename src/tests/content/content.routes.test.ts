import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../app';
import { ContentBDDRepository } from '../../modules/content/content.bdd.repository';

jest.mock('../../modules/content/content.bdd.repository');

describe('Content Routes with Mocks', () => {
    let app: Express;

    let mockFindAll: jest.Mock;
    let mockFindById: jest.Mock;
    let mockCreate: jest.Mock;
    let mockUpdateById: jest.Mock;
    let mockDeleteById: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        mockFindAll = jest.fn();
        mockFindById = jest.fn();
        mockCreate = jest.fn();
        mockUpdateById = jest.fn();
        mockDeleteById = jest.fn();

        ContentBDDRepository.prototype.findAll = mockFindAll;
        ContentBDDRepository.prototype.findById = mockFindById;
        ContentBDDRepository.prototype.create = mockCreate;
        ContentBDDRepository.prototype.updateById = mockUpdateById;
        ContentBDDRepository.prototype.deleteById = mockDeleteById;

        app = createApp();
    });

    describe('GET /content', () => {
        it('should return all contents with status 200', async () => {
            mockFindAll.mockResolvedValue([
                {
                    id: 'content-1',
                    api_id: 'api-1',
                    title: 'Content 1',
                    description: 'Description 1',
                    content_type: 'article',
                    created_at: new Date().toISOString(),
                },
            ]);

            const res = await request(app).get('/content');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toHaveProperty('id', 'content-1');
        });
    });

    describe('GET /content/:id', () => {
        it('should return one content with status 200', async () => {
            mockFindById.mockResolvedValue({
                id: 'content-1',
                api_id: 'api-1',
                title: 'Content 1',
                description: 'Description 1',
                content_type: 'article',
                created_at: new Date().toISOString(),
            });

            const res = await request(app).get('/content/content-1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', 'content-1');
        });

        it('should return 404 when content does not exist', async () => {
            mockFindById.mockResolvedValue(null);

            const res = await request(app).get('/content/missing-id');

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Content not found');
        });
    });

    describe('POST /content', () => {
        it('should create a content and return 201', async () => {
            mockCreate.mockResolvedValue({
                id: 'content-2',
                api_id: 'api-2',
                title: 'New Content',
                description: 'New Description',
                content_type: 'show',
                created_at: new Date().toISOString(),
            });

            const payload = {
                api_id: 'api-2',
                title: 'New Content',
                description: 'New Description',
                content_type: 'show',
            };

            const res = await request(app)
                .post('/content')
                .send(payload);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id', 'content-2');
        });

        it('should return 400 when payload is incomplete', async () => {
            const res = await request(app)
                .post('/content')
                .send({ title: 'Invalid' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'api_id, title and content_type are required');
        });
    });

    describe('PUT /content/:id', () => {
        it('should update content and return 200', async () => {
            mockUpdateById.mockResolvedValue({
                id: 'content-1',
                api_id: 'api-1',
                title: 'Updated title',
                description: 'Updated description',
                content_type: 'podcast',
                created_at: new Date().toISOString(),
            });

            const res = await request(app)
                .put('/content/content-1')
                .send({ title: 'Updated title', content_type: 'podcast' });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('title', 'Updated title');
        });

        it('should return 404 when updating unknown content', async () => {
            mockUpdateById.mockResolvedValue(null);

            const res = await request(app)
                .put('/content/missing-id')
                .send({ title: 'Updated title' });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Content not found');
        });
    });

    describe('DELETE /content/:id', () => {
        it('should delete content and return 200', async () => {
            mockDeleteById.mockResolvedValue({
                id: 'content-1',
                api_id: 'api-1',
                title: 'To delete',
                description: 'To delete',
                content_type: 'article',
                created_at: new Date().toISOString(),
            });

            const res = await request(app).delete('/content/content-1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', 'content-1');
        });

        it('should return 404 when deleting unknown content', async () => {
            mockDeleteById.mockResolvedValue(null);

            const res = await request(app).delete('/content/missing-id');

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Content not found');
        });
    });
});

