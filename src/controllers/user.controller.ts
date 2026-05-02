import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import {LoginUserDTO, ModifyUserDTO} from "../DTO/userDTO";
import logger from "../config/logger";

export class UserController {
    constructor(
        private readonly userService : UserService) {}

    createUser = async (req: Request, res: Response) => {
        try {
            logger.info("createUser request body:", req.body);
            const token = await this.userService.createUser(req.body);
            res.status(201).json(token);
        } catch (error: any) {
            logger.error(error);
            res.status(400).json({ message: error.message });
        }
    }

    loginUser = async (req: Request, res: Response) => {
        try {
            const token = await this.userService.login(req.body as LoginUserDTO);
            if (!token) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            res.status(200).json(token);
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getMe = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId;
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Removing password from response
            const { password, ...userWithoutPassword } = user;
            res.status(200).json(userWithoutPassword);
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    updateMe = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId;
            const updateData: ModifyUserDTO = {
                ...req.body,
                id: userId
            };
            const updatedUser = await this.userService.modifyUser(updateData);
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Removing password from response
            const { password, ...userWithoutPassword } = updatedUser;
            res.status(200).json(userWithoutPassword);
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    searchPublicUsers = async (req: Request, res: Response) => {
        try {
            const { q } = req.query;
            if (!q || typeof q !== 'string') {
                return res.status(400).json({ message: 'Search query is required' });
            }
            // This will need to be implemented in the repository
            // For now, returning empty array
            res.status(200).json([]);
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getUserById = async(req: Request, res: Response) => {
        const user = await this.userService.getUserById(req.params.id as string);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }

    getUserByEmail = async(req: Request, res: Response) => {
        const user = await this.userService.getUserByEmail(req.params.email as string);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    };

    deleteUserById = async(req: Request, res: Response) => {
        const user = await this.userService.deleteUserById(req.params.user as string)
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
}