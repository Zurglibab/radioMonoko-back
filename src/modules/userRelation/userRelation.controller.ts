import { Request, Response } from 'express';
import { UserRelationService } from './userRelation.service';
import logger from '../../config/logger';
import { FollowDTO } from './userRelation.dto';
import {ApiError} from "../../config/ApiError";

export class UserRelationController {
    constructor(private readonly userRelationService: UserRelationService) {}

    follow = async (req: Request, res: Response): Promise<void> => {
        try {
            const followedId = (req as any).user.id;
            const followerId = (req.params.id);

            if (followedId === followerId) {
                const message = "You cannot follow yourself";
                logger.error(`[UserRelationController] Error following user: ${message}`);
                throw new ApiError(400, message);
            }

            logger.info(`[UserRelationController] User ${followerId} following user ${followedId}`);
            const relation = await this.userRelationService.follow(followerId, followedId);
            res.status(201).json(relation);
        } catch (error: any) {
            logger.error(`[UserRelationController] Error following user: ${error.message}`);
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    unfollow = async (req: Request, res: Response): Promise<void> => {
        try {
            const followedId = (req as any).user.id;
            const followerId = req.params.id;

            if (followedId === followerId) {
                const message = "You cannot follow yourself";
                logger.error(`[UserRelationController] Error following user: ${message}`);
                throw new ApiError(400, message);
            }

            logger.info(`[UserRelationController] User ${followedId} unfollowing user ${followerId}`);
            await this.userRelationService.unfollow(followerId, followedId);
            res.status(200).send();
        } catch (error: any) {
            logger.error(`[UserRelationController] Error unfollowing user: ${error.message}`);
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    accept = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const requesterId = req.params.id;
            logger.info(`[UserRelationController] User ${userId} accepting request from ${requesterId}`);
            const relation = await this.userRelationService.accept(userId, requesterId);
            res.status(200).json(relation);
        } catch (error: any) {
            logger.error(`[UserRelationController] Error accepting request: ${error.message}`);
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    refuse = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const requesterId = req.params.id;
            logger.info(`[UserRelationController] User ${userId} refusing request from ${requesterId}`);
            const relation = await this.userRelationService.refuse(userId, requesterId);
            res.status(200).json(relation);
        } catch (error: any) {
            logger.error(`[UserRelationController] Error refusing request: ${error.message}`);
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    block = async (req: Request, res: Response): Promise<void> => {
        try {
            const blockerId = (req as any).user.id;
            const blockedId = req.params.id;
            logger.info(`[UserRelationController] User ${blockerId} blocking user ${blockedId}`);
            const relation = await this.userRelationService.block(blockerId, blockedId);
            res.status(200).json(relation);
        } catch (error: any) {
            logger.error(`[UserRelationController] Error blocking user: ${error.message}`);
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    getFriends = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const targetUserId = req.params.id;
            logger.info(`[UserRelationController] Getting friends for user ${targetUserId}`);
            const friends = await this.userRelationService.getFriends(userId, targetUserId);
            res.status(200).json(friends);
        } catch (error: any) {
            logger.error(`[UserRelationController] Error getting friends: ${error.message}`);
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    getPendingRequests = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            logger.info(`[UserRelationController] Getting pending requests for user ${userId}`);
            const requests = await this.userRelationService.getPendingRequests(userId);
            res.status(200).json(requests);
        } catch (error: any) {
            logger.error(`[UserRelationController] Error getting pending requests: ${error.message}`);
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }
}
