import { Router } from 'express';
import {UserService} from "./user.services";
import {UserController} from "./user.controller";

import {userBDDRepository} from "./user.bdd.repository";

const userRouter = Router();
const userRepository = new userBDDRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter.post('/create', userController.createUser);
userRouter.get('/:email', userController.getUserByEmail);
userRouter.get('/id/:id', userController.getUserById);
userRouter.delete('/delete/:id', userController.deleteUserById);
export default userRouter;