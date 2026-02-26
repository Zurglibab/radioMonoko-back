import { request , response } from 'express';
import { UserService } from './user.services';
import {LoginUserDTO} from "./user.dto";

export class UserController {
    constructor(
        private readonly userService : UserService) {}

    createUser = async (req: request, res: response) => {
        try {
            console.log("req.body :", req.body);
            const token = await this.userService.createUser(req.body);
            res.status(201).json(token);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    }

    loginUser = async (req: request, res:response) => {
        try {
            const token = await this.userService.login(req.body as LoginUserDTO);
            if (!token) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            res.status(200).json(token);
        } catch (error: any) {
            res.status(500).json({ message: 'Internal server error' });
            console.error(error);
        }
    }

    getUserById = async(req: request, res: response) => {
        const user = await this.userService.getUserById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }

    getUserByEmail = async(req: request, res: response) => {
        const user = await this.userService.getUserByEmail(req.params.email);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    };

    deleteUserById = async(req: request, res: response) => {
        const user = await this.userService.deleteUserById(req.params.user)
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
}