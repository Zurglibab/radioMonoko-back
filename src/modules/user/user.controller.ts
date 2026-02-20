import { request , response } from 'express';
import { UserService } from './user.services';

export class UserController {
    constructor(
        private readonly userService : UserService) {}

    createUser = async (req: request, res: response) => {
        const user = await this.userService.createUser(req.body);
        res.status(201).json(user);
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