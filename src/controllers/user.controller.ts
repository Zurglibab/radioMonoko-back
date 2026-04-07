import { Request, Response } from 'express';
import { UserService } from '../services/user.services';
import {LoginUserDTO, ModifyUserDTO} from "../DTO/user.dto";
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

    getUserById = async(req: Request, res: Response) => {
        try {
            const user = await this.userService.getUserById(req.params.id as string);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const { password, ...userWithoutPassword } = user;
            res.status(200).json(userWithoutPassword);
        } catch (error: any) {
            logger.error(`Error in getUserById: ${error.message}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getUserByEmail = async(req: Request, res: Response) => {
        try {
            const user = await this.userService.getUserByEmail(req.params.email as string);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const { password, ...userWithoutPassword } = user;
            res.status(200).json(userWithoutPassword);
        } catch (error: any) {
            logger.error(`Error in getUserByEmail: ${error.message}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    deleteUserById = async(req: Request, res: Response) => {
        try {
            const user = await this.userService.deleteUserById(req.params.id as string);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error: any) {
            logger.error(`Error in deleteUserById: ${error.message}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    updateMe = async (req: Request, res: Response) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Non autorisé' });
            }

            if (req.body.password) {
                return res.status(403).json({ message: 'Modification du mot de passe non autorisée via cette route' });
            }

            const dto: ModifyUserDTO = {
                id: req.user.id,
                ...req.body
            };

            const updatedUser = await this.userService.modifyUser(dto);
            if (!updatedUser) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            // Return user without password
            const { password, ...userWithoutPassword } = updatedUser;
            res.status(200).json(userWithoutPassword);
        } catch (error: any) {
            logger.error(`Error in updateMe: ${error.message}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getMe = async (req: Request, res: Response) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Non autorisé' });
            }

            const user = await this.userService.getUserById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            const { password, ...userWithoutPassword } = user;
            res.status(200).json(userWithoutPassword);
        } catch (error: any) {
            logger.error(`Error in getMe: ${error.message}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    searchPublicUsers = async (req: Request, res: Response) => {
        try {
            const query = req.query.q as string;
            if (!query) {
                return res.status(400).json({ message: 'Paramètre de recherche "q" manquant' });
            }
            const users = await this.userService.searchPublicUsers(query);
            const usersWithoutPassword = users.map(user => {
                const { password, ...rest } = user;
                return rest;
            });
            res.status(200).json(usersWithoutPassword);
        } catch (error: any) {
            logger.error(`Error in searchPublicUsers: ${error.message}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}