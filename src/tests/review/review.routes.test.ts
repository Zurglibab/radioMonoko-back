import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../app';
import { ReviewDAO } from '../../DAO/reviewDAO';

jest.mock('../../DAO/reviewDAO');

describe('Review Routes with Mocks', () => {
    let app: Express;
    let mockFindAll: jest.Mock;
    let mockFindById: jest.Mock;
    let mockFindByContentId: jest.Mock;
    let mockCreate: jest.Mock;
    let mockUpdateById: jest.Mock;
    let mockDeleteById: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        mockFindAll = jest.fn();
        mockFindById = jest.fn();
        mockFindByContentId = jest.fn();
        mockCreate = jest.fn();
        mockUpdateById = jest.fn();
        mockDeleteById = jest.fn();

        ReviewDAO.prototype.findAll = mockFindAll;
        ReviewDAO.prototype.findById = mockFindById;
        ReviewDAO.prototype.findByContentId = mockFindByContentId;
        ReviewDAO.prototype.create = mockCreate;
        ReviewDAO.prototype.updateById = mockUpdateById;
        ReviewDAO.prototype.deleteById = mockDeleteById;

        app = createApp();
    });

    describe('GET /review', () => {
        it('should return all reviews with status 200', async () => {
            mockFindAll.mockResolvedValue([
                {
                    id: 'review-1',
                    user_id: 'user-1',
                    content_id: 'content-1',
                    parent_review_id: null,
                    comment: 'Great content',
                    created_at: new Date().toISOString(),
                },
            ]);

            const res = await request(app).get('/review');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toHaveProperty('id', 'review-1');
        });
    });

    describe('GET /review/:id', () => {
        it('should return one review with status 200', async () => {
            mockFindById.mockResolvedValue({
                id: 'review-1',
                user_id: 'user-1',
                content_id: 'content-1',
                parent_review_id: null,
                comment: 'Great content',
                created_at: new Date().toISOString(),
            });

            const res = await request(app).get('/review/review-1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', 'review-1');
        });

        it('should return 404 when review does not exist', async () => {
            mockFindById.mockResolvedValue(null);

            const res = await request(app).get('/review/missing-id');

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Review not found');
        });
    });

    describe('GET /review/content/:contentId', () => {
        it('should return reviews by content with status 200', async () => {
            mockFindByContentId.mockResolvedValue([
                {
                    id: 'review-1',
                    user_id: 'user-1',
                    content_id: 'content-1',
                    parent_review_id: null,
                    comment: 'Great content',
                    created_at: new Date().toISOString(),
                },
            ]);

            const res = await request(app).get('/review/content/content-1');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('POST /review', () => {
        it('should create a review and return 201', async () => {
            mockCreate.mockResolvedValue({
                id: 'review-2',
                user_id: 'user-1',
                content_id: 'content-2',
                parent_review_id: 'review-1',
                comment: 'New review',
                created_at: new Date().toISOString(),
            });

            const res = await request(app)
                .post('/review')
                .send({ user_id: 'user-1', content_id: 'content-2', parent_review_id: 'review-1', comment: 'New review' });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id', 'review-2');
        });

        it('should create a root review without parent_review_id and return 201', async () => {
            mockCreate.mockResolvedValue({
                id: 'review-root',
                user_id: 'user-1',
                content_id: 'content-3',
                parent_review_id: null,
                comment: 'Root review',
                created_at: new Date().toISOString(),
            });

            const res = await request(app)
                .post('/review')
                .send({ user_id: 'user-1', content_id: 'content-3', comment: 'Root review' });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id', 'review-root');
            expect(res.body).toHaveProperty('parent_review_id', null);
        });

        it('should return 400 when payload is incomplete', async () => {
            const res = await request(app)
                .post('/review')
                .send({ comment: 'Invalid' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'user_id and content_id are required');
        });
    });

    describe('PUT /review/:id', () => {
        it('should update review and return 200', async () => {
            mockUpdateById.mockResolvedValue({
                id: 'review-1',
                user_id: 'user-1',
                content_id: 'content-1',
                parent_review_id: 'review-parent',
                comment: 'Updated review',
                created_at: new Date().toISOString(),
            });

            const res = await request(app)
                .put('/review/review-1')
                .send({ parent_review_id: 'review-parent', comment: 'Updated review' });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('comment', 'Updated review');
        });

        it('should return 404 when updating unknown review', async () => {
            mockUpdateById.mockResolvedValue(null);

            const res = await request(app)
                .put('/review/missing-id')
                .send({ comment: 'Updated review' });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Review not found');
        });
    });

    describe('DELETE /review/:id', () => {
        it('should delete review and return 200', async () => {
            mockDeleteById.mockResolvedValue({
                id: 'review-1',
                user_id: 'user-1',
                content_id: 'content-1',
                parent_review_id: null,
                comment: 'To delete',
                created_at: new Date().toISOString(),
            });

            const res = await request(app).delete('/review/review-1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', 'review-1');
        });

        it('should return 404 when deleting unknown review', async () => {
            mockDeleteById.mockResolvedValue(null);

            const res = await request(app).delete('/review/missing-id');

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Review not found');
        });
    });
});

