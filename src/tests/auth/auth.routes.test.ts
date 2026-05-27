

import request from 'supertest';


jest.mock('../../config/passport', () => {
  const mockPassport = {
    authenticate: (...args: any[]) => {
      const maybeDone = args[2];
      return (req: any, res: any, next: any) => {
        if (typeof maybeDone === 'function') {
          return maybeDone(null, { id: 'mock-user-id', email: 'mock@user.test' });
        }
        return next();
      };
    },

    initialize: () => (req: any, res: any, next: any) => next()
  };
  return {
    __esModule: true,
    default: mockPassport,
    isGoogleOAuthConfigured: true
  };
});

import { createApp } from '../../app';
import * as jwt from 'jsonwebtoken';

const app = createApp();

describe('Auth Routes (Google OAuth)', () => {
  beforeAll(() => {
    process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'fake-client-id';
    process.env.GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
  });

  it('GET /auth/google should redirect to Google with scope and client_id', async () => {
    const res = await request(app).get('/auth/google').expect(302);
    const location = res.headers['location'];
    expect(location).toBeDefined();
    expect(location).toContain('accounts.google.com');

    expect(location).toMatch(/scope=profile(%20|\+)email/);
    expect(location).toContain(`client_id=${encodeURIComponent(process.env.GOOGLE_CLIENT_ID!)}`);
  });

  it('GET /auth/google/callback should return a JWT token and user when passport authenticates', async () => {
    const res = await request(app).get('/auth/google/callback').expect(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET as string) as any;
    expect(decoded).toHaveProperty('id', 'mock-user-id');
    expect(decoded).toHaveProperty('email', 'mock@user.test');
  });
});