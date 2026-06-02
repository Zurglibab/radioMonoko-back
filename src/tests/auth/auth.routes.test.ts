import request from 'supertest';
import axios from 'axios';

// Mock passport
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

// Mock UserDAO
jest.mock('../../DAO/userDAO', () => {
  return {
    UserDAO: jest.fn().mockImplementation(() => {
      return {
        findByEmail: jest.fn().mockImplementation((email: string) => {
          if (email === 'new-mobile@user.test') {
            return Promise.resolve(null);
          }
          return Promise.resolve({ id: 'mock-mobile-id', email });
        }),
        create: jest.fn().mockImplementation((user: any) => {
          return Promise.resolve({ id: user.id || 'new-mock-id', email: user.email });
        })
      };
    })
  };
});

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { createApp } from '../../app';
import * as jwt from 'jsonwebtoken';

const app = createApp();

describe('Auth Routes (Google OAuth)', () => {
  beforeAll(() => {
    process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'fake-client-id';
    process.env.GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  describe('POST /auth/google-mobile', () => {
    it('returns 400 if googleToken is missing', async () => {
      const res = await request(app).post('/auth/google-mobile').send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('googleToken is required');
    });

    it('authenticates successfully with a valid ID token (existing user)', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { email: 'mobile@user.test', email_verified: 'true' }
      });

      const res = await request(app)
        .post('/auth/google-mobile')
        .send({ googleToken: 'valid-id-token' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toMatchObject({ email: 'mobile@user.test' });

      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET as string) as any;
      expect(decoded).toHaveProperty('email', 'mobile@user.test');
    });

    it('authenticates successfully and registers a new user with a valid access token (fallback)', async () => {
      // 1) id_token check fails (rejects)
      mockedAxios.get.mockRejectedValueOnce(new Error('Invalid ID Token'));
      // 2) access_token check succeeds
      mockedAxios.get.mockResolvedValueOnce({
        data: { email: 'new-mobile@user.test' }
      });

      const res = await request(app)
        .post('/auth/google-mobile')
        .send({ googleToken: 'valid-access-token' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('new-mobile@user.test');
    });

    it('returns 401 if both verification methods fail', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Invalid ID Token'));
      mockedAxios.get.mockRejectedValueOnce(new Error('Invalid Access Token'));

      const res = await request(app)
        .post('/auth/google-mobile')
        .send({ googleToken: 'invalid-token' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid Google token');
    });
  });
});