import request from 'supertest';
import { createApp } from '../app';
import { UserController } from '../modules/user/user.controller';
import { UserService } from '../modules/user/user.services';
import { userBDDRepository } from '../modules/user/user.bdd.repository';

// Mock the UserService
jest.mock('../modules/user/user.services');

const app = createApp();

describe('User Routes', () => {
  let userService: jest.Mocked<UserService>;

  beforeAll(() => {
    const userRepository = new userBDDRepository(); // This will be mocked
    userService = new UserService(userRepository) as jest.Mocked<UserService>;
    new UserController(userService);
  });

  describe('POST /user/register', () => {
    it('should create a new user and return a token', async () => {
      const userData = { email: 'test@example.com', password: 'password' };
      const tokenResponse = { token: 'some.jwt.token' };

      (userService.createUser as jest.Mock).mockResolvedValue(tokenResponse);

      const response = await request(app)
          .post('/user/create')
          .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(tokenResponse);
      expect(userService.createUser).toHaveBeenCalledWith(userData);
    });
  });
});
