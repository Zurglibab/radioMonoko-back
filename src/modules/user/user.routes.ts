import { Router } from 'express';
import {UserService} from "./user.services";
import {UserController} from "./user.controller";
import {UserBDDRepository} from "./user.bdd.repository";
import { authMiddleware } from '../../middlewares/auth.middleware';

const userRouter = Router();
const userRepository = new UserBDDRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter.post('/register', userController.createUser);
userRouter.post('/login', userController.loginUser);

userRouter.get('/:email', authMiddleware, userController.getUserByEmail);
userRouter.get('/id/:id', authMiddleware, userController.getUserById);
userRouter.delete('/delete/:id', authMiddleware, userController.deleteUserById);


export default userRouter;