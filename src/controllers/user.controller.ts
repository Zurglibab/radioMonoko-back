import {Request, Response} from 'express';
import {UserService} from '../services/userService';
import {ContentStatusService} from '../services/contentStatusService';
import {LoginUserDTO, ModifyUserDTO} from "../DTO/userDTO";
import logger from "../config/logger";
import * as jwt from "jsonwebtoken";
import {getClient} from "../config/RedisConnexion";
import { RatingContentDAO } from '../DAO/ratingContentDAO';
import { ContentFavoriteDAO } from '../DAO/contentFavoriteDAO';
import { CollectionDAO } from '../DAO/collectionDAO';
import { CollectionItemsDTO } from '../DAO/collectionItemsDTO';
import { ReviewDAO } from '../DAO/reviewDAO';

export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly contentStatusService: ContentStatusService
    ) {}

    getMyLibrary = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId;
            const library = await this.contentStatusService.getUserLibrary(userId);
            res.status(200).json(library);
        } catch (error: any) {
            logger.error("Error in getMyLibrary:", error);
            res.status(500).json({message: 'Internal server error'});
        }
    };

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
            if (error.message === 'USER_BANNED') {
                return res.status(403).json({message: 'Votre compte a été banni.'});
            }
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

    toggleNotifications = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId ?? (req as any).user?.id;
            if (!userId) return res.status(401).json({ message: 'Authentication required' });

            const body = req.body as { value?: boolean } | undefined;
            const value = body?.value;
            const updated = await this.userService.toggleNotificationsEmail(userId, value);
            if (!updated) return res.status(404).json({ message: 'User not found' });
            const { password, ...userWithoutPassword } = updated as any;
            return res.status(200).json(userWithoutPassword);
        } catch (error: any) {
            logger.error('toggleNotifications error', error);
            return res.status(500).json({ message: 'Internal server error' });
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

    uploadAvatarBase64 = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId ?? (req as any).user?.id;
            if (!userId) return res.status(401).json({ message: 'Authentication required' });

            const { avatar } = req.body as { avatar?: string };
            if (!avatar || typeof avatar !== 'string') {
                return res.status(400).json({ message: 'avatar (base64 data URL) is required' });
            }

            // Validate Data URL (mime + base64)
            const matches = /^data:(image\/(png|jpe?g|webp));base64,([A-Za-z0-9+/=]+)$/.exec(avatar);
            if (!matches) return res.status(400).json({ message: 'Invalid image data URL or unsupported mime type' });

            // Compute approximate byte size from base64 length to protect memory
            const base64 = matches[3];
            const padding = (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0);
            const bytes = Math.floor((base64.length * 3) / 4) - padding;
            const MAX_BYTES = 2 * 1024 * 1024; // 2MB
            if (bytes > MAX_BYTES) return res.status(413).json({ message: 'File too large' });

            // Persist directly in DB: the `avatar` column is TEXT and will hold the data URL
            const updated = await this.userService.modifyUser({ id: userId, avatar });
            if (!updated) return res.status(404).json({ message: 'User not found' });

            const { password, ...userWithoutPassword } = updated as any;
            return res.status(200).json(userWithoutPassword);
        } catch (error: any) {
            logger.error('uploadAvatarBase64 error', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Export all user data for RGPD (profile, favorites, statuses, collections+items, ratings)
    exportUserData = async (req: Request, res: Response) => {
        try {
            const targetUserId = req.params.id as string;
            // basic validation
            if (!targetUserId) return res.status(400).json({ message: 'User id is required' });

            // profile
            let profile;
            try {
                profile = await this.userService.getUserById(targetUserId);
                if (!profile) return res.status(404).json({ message: 'User not found' });
            } catch (err) {
                logger.error('exportUserData: error fetching profile', { userId: targetUserId, err });
                return res.status(500).json({ message: 'Error fetching user profile' });
            }
            const { password, ...profileSafe } = profile as any;

            // favorites
            let favorites;
            try {
                const favDao = new ContentFavoriteDAO();
                favorites = await favDao.findByUserId(targetUserId);
            } catch (err: any) {
                logger.error('exportUserData: error fetching favorites', { userId: targetUserId, err });
                return res.status(500).json({ message: 'Error fetching favorites', error: err?.message || String(err) });
            }

            // content statuses (library) - use injected service
            let statuses;
            try {
                statuses = await this.contentStatusService.getUserLibrary(targetUserId);
            } catch (err: any) {
                logger.error('exportUserData: error fetching statuses', { userId: targetUserId, err });
                return res.status(500).json({ message: 'Error fetching content statuses', error: err?.message || String(err) });
            }

            // collections and items
            let collectionsWithItems;
            try {
                const collectionDao = new CollectionDAO();
                const collections = await collectionDao.findByUserId(targetUserId);
                const collectionItemsDao = new CollectionItemsDTO();
                collectionsWithItems = await Promise.all(collections.map(async (col: any) => {
                    const items = await collectionItemsDao.findByCollectionId(col.id);
                    return {
                        ...col,
                        items
                    };
                }));
            } catch (err: any) {
                logger.error('exportUserData: error fetching collections/items', { userId: targetUserId, err });
                return res.status(500).json({ message: 'Error fetching collections or collection items', error: err?.message || String(err) });
            }

            // ratings (notes)
            let ratings;
            try {
                const ratingDao = new RatingContentDAO();
                const allRatings = await ratingDao.findAll();
                ratings = allRatings.filter((r: any) => r.user_id === targetUserId);
            } catch (err: any) {
                logger.error('exportUserData: error fetching ratings', { userId: targetUserId, err });
                return res.status(500).json({ message: 'Error fetching ratings', error: err?.message || String(err) });
            }

            // reviews (user's own reviews)
            let reviews;
            try {
                const reviewDao = new ReviewDAO();
                const allReviews = await reviewDao.findAll();
                reviews = allReviews.filter((r: any) => r.user_id === targetUserId);
            } catch (err: any) {
                logger.error('exportUserData: error fetching reviews', { userId: targetUserId, err });
                return res.status(500).json({ message: 'Error fetching reviews', error: err?.message || String(err) });
            }

            // Compose export
            const exportData = {
                profile: profileSafe,
                favorites,
                statuses,
                collections: collectionsWithItems,
                ratings,
                reviews
            };

            return res.status(200).json(exportData);
        } catch (error: any) {
            logger.error('exportUserData error', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}