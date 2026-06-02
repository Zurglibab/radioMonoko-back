import {Request, Response} from 'express';
import {UserService} from '../services/userService';
import {LoginUserDTO, ModifyUserDTO} from "../DTO/userDTO";
import logger from "../config/logger";
import * as jwt from "jsonwebtoken";
import {getClient} from "../config/RedisConnexion";

export class UserController {
    constructor(
        private readonly userService: UserService) {
    }

    createUser = async (req: Request, res: Response) => {
        try {
            logger.info("createUser request body:", req.body);
            const token = await this.userService.createUser(req.body);
            res.status(201).json(token);
        } catch (error: any) {
            logger.error(error);
            res.status(400).json({message: error.message});
        }
    };

    loginUser = async (req: Request, res: Response) => {
        try {
            const token = await this.userService.login(req.body as LoginUserDTO);
            if (!token) {
                return res.status(401).json({message: 'Invalid credentials'});
            }
            res.status(200).json(token);
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({message: 'Internal server error'});
        }
    };

    refreshToken = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId;
            const authHeader = req.headers.authorization;
            if (!authHeader?.startsWith('Bearer ')) {
                return res.status(400).json({ message: 'Token required' });
            }
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.decode(token) as any;
                const redis = getClient();
                let ttlSeconds = 60 * 60 * 24; // default 24h
                if (decoded?.exp) {
                    const now = Math.floor(Date.now() / 1000);
                    ttlSeconds = Math.max(1, decoded.exp - now);
                }
                if (redis?.isOpen) {
                    await redis.set(`blacklist:${token}`, '1', { EX: ttlSeconds });
                }
            } catch (err) {
                console.error('[auth/logout] Error revoking token', err);
                return res.status(401).json({message: 'Invalid token'});
            }
            const newToken = await this.userService.refreshToken(userId);
            if (!newToken) {
                return res.status(401).json({message: 'Invalid refresh token'});
            }
            res.status(200).json(newToken);
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({message: 'Internal server error'});
        }
    }

    getMe = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId;
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }

            const {password, ...userWithoutPassword} = user;
            res.status(200).json(userWithoutPassword);
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({message: 'Internal server error'});
        }
    };

    updateMe = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId;
            if (typeof req.body?.password !== 'undefined') {
                return res.status(403).json({message: 'Modification du mot de passe non autorisée via cette route'});
            }
            const updateData: ModifyUserDTO = {
                ...req.body,
                id: userId
            };
            const updatedUser = await this.userService.modifyUser(updateData);
            if (!updatedUser) {
                return res.status(404).json({message: 'User not found'});
            }

            const {password, ...userWithoutPassword} = updatedUser;
            res.status(200).json(userWithoutPassword);
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({message: 'Internal server error'});
        }
    };

    searchPublicUsers = async (req: Request, res: Response) => {
        try {
            const {q} = req.query;
            if (!q || typeof q !== 'string') {
                return res.status(400).json({message: 'Search query is required'});
            }
            const users = await this.userService.searchPublicUsers(q);
            return res.status(200).json(users);
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({message: 'Internal server error'});
        }
    };

    getUserById = async (req: Request, res: Response) => {
        try {
            const user = await this.userService.getUserById(req.params.id as string);
            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }
            return res.status(200).json(user);
        } catch (error: any) {
            logger.error(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    };

    getUserByEmail = async (req: Request, res: Response) => {
        try {
            const user = await this.userService.getUserByEmail(req.params.email as string);
            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }
            return res.status(200).json(user);
        } catch (error: any) {
            logger.error(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    };

    deleteUserById = async (req: Request, res: Response) => {
        try {
            const user = await this.userService.deleteUserById(req.params.id as string);
            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }
            return res.status(200).json(user);
        } catch (error: any) {
            logger.error(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    };
}