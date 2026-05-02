import { Router } from 'express';
import {UserService} from "../services/userService";
import {UserController} from "../controllers/user.controller";
import {UserDAO} from "../DAO/userDAO";
import { authMiddleware } from '../middlewares/auth.middleware';

const userRouter = Router();
const userRepository = new UserDAO();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter.post('/register', userController.createUser);
userRouter.post('/login', userController.loginUser);

userRouter.get('/:email', authMiddleware, userController.getUserByEmail);
userRouter.get('/id/:id', authMiddleware, userController.getUserById);
userRouter.delete('/delete/:id', authMiddleware, userController.deleteUserById);

export default userRouter;

export {};
