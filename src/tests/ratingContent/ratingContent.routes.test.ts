import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../app';
import { RatingContentBDDRepository } from '../../modules/ratingContent/ratingContent.bdd.repository';

jest.mock('../../modules/ratingContent/ratingContent.bdd.repository');

describe('RatingContent Routes with Mocks', () => {
    let app: Express;

    let mockFindAll: jest.Mock;
    let mockFindByKeys: jest.Mock;
    let mockCreate: jest.Mock;
    let mockUpdateByKeys: jest.Mock;
    let mockDeleteByKeys: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        mockFindAll = jest.fn();
        mockFindByKeys = jest.fn();
        mockCreate = jest.fn();
        mockUpdateByKeys = jest.fn();
        mockDeleteByKeys = jest.fn();

        RatingContentBDDRepository.prototype.findAll = mockFindAll;
        RatingContentBDDRepository.prototype.findByKeys = mockFindByKeys;
        RatingContentBDDRepository.prototype.create = mockCreate;
        RatingContentBDDRepository.prototype.updateByKeys = mockUpdateByKeys;
        RatingContentBDDRepository.prototype.deleteByKeys = mockDeleteByKeys;

        app = createApp();
    });

    describe('GET /ratingContent', () => {
        it('should return all ratings with status 200', async () => {
            mockFindAll.mockResolvedValue([
                { content_id: 'content-1', user_id: 'user-1', average_rating: 4.5 },
            ]);

            const res = await request(app).get('/ratingContent');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toHaveProperty('content_id', 'content-1');
        });
    });

    describe('GET /ratingContent/content/:contentId/user/:userId', () => {
        it('should return one rating with status 200', async () => {
            mockFindByKeys.mockResolvedValue({
                content_id: 'content-1',
                user_id: 'user-1',
                average_rating: 4.5,
            });

            const res = await request(app).get('/ratingContent/content/content-1/user/user-1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('content_id', 'content-1');
            expect(res.body).toHaveProperty('user_id', 'user-1');
        });

        it('should return 404 when rating does not exist', async () => {
            mockFindByKeys.mockResolvedValue(null);

            const res = await request(app).get('/ratingContent/content/content-1/user/user-404');

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Rating not found');
        });
    });

    describe('POST /ratingContent', () => {
        it('should create a rating and return 201', async () => {
            mockCreate.mockResolvedValue({
                content_id: 'content-2',
                user_id: 'user-2',
                average_rating: 3.75,
            });

            const payload = {
                content_id: 'content-2',
                user_id: 'user-2',
                average_rating: 3.75,
            };

            const res = await request(app).post('/ratingContent').send(payload);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('content_id', 'content-2');
            expect(res.body).toHaveProperty('user_id', 'user-2');
        });

        it('should return 400 when payload is incomplete', async () => {
            const res = await request(app).post('/ratingContent').send({ content_id: 'content-2' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'content_id, user_id and average_rating are required');
        });

        it('should return 400 when average_rating is out of range', async () => {
            const res = await request(app)
                .post('/ratingContent')
                .send({ content_id: 'content-2', user_id: 'user-2', average_rating: 9 });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'average_rating must be a number between 0 and 5');
        });
    });

    describe('PUT /ratingContent/content/:contentId/user/:userId', () => {
        it('should update rating and return 200', async () => {
            mockUpdateByKeys.mockResolvedValue({
                content_id: 'content-1',
                user_id: 'user-1',
                average_rating: 4.8,
            });

            const res = await request(app)
                .put('/ratingContent/content/content-1/user/user-1')
                .send({ average_rating: 4.8 });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('average_rating', 4.8);
        });

        it('should return 404 when updating unknown rating', async () => {
            mockUpdateByKeys.mockResolvedValue(null);

            const res = await request(app)
                .put('/ratingContent/content/content-1/user/user-404')
                .send({ average_rating: 4.8 });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Rating not found');
        });
    });

    describe('DELETE /ratingContent/content/:contentId/user/:userId', () => {
        it('should delete rating and return 200', async () => {
            mockDeleteByKeys.mockResolvedValue({
                content_id: 'content-1',
                user_id: 'user-1',
                average_rating: 4.5,
            });

            const res = await request(app).delete('/ratingContent/content/content-1/user/user-1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('content_id', 'content-1');
        });

        it('should return 404 when deleting unknown rating', async () => {
            mockDeleteByKeys.mockResolvedValue(null);

            const res = await request(app).delete('/ratingContent/content/content-404/user/user-404');

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Rating not found');
        });
    });
});

