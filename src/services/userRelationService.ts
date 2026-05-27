import { UserRelationRepository } from '../repository/userRelationRepository';
import { UserRepository } from '../repository/userRepository';
import { UserRelation } from '../interfaces/userRelationInterface';
import { ApiError } from '../config/ApiError';
import logger from '../config/logger';

export class UserRelationService {
    constructor(
        private readonly userRelationRepository: UserRelationRepository,
        private readonly userRepository: UserRepository
    ) {}

    async follow(followerId: string, followedId: string): Promise<void> {
        logger.info(`[UserRelationService] User ${followerId} wants to follow ${followedId}`);
        if (followerId === followedId) {
            throw new ApiError(400, 'You cannot follow yourself');
        }
        const followedUser = await this.userRepository.findById(followedId);
        if (!followedUser) {
            throw new ApiError(404, 'User to follow not found');
        }
        const existingRelation = await this.userRelationRepository.findRelation(followerId, followedId);
        if (existingRelation) {
            throw new ApiError(400, 'You are already following or have a pending request for this user');
        }
        await this.userRelationRepository.follow(followerId, followedId);
    }

    async unfollow(followerId: string, followedId: string): Promise<void> {
        logger.info(`[UserRelationService] User ${followerId} wants to unfollow ${followedId}`);
        const existingRelation = await this.userRelationRepository.findRelation(followerId, followedId);
        if (!existingRelation) {
            throw new ApiError(404, 'You are not following this user');
        }
        return this.userRelationRepository.unfollow(followerId, followedId);
    }

    async accept(userId: string, requesterId: string): Promise<void> {
        logger.info(`[UserRelationService] User ${userId} wants to accept request from ${requesterId}`);
        const relation = await this.userRelationRepository.findRelation(requesterId, userId);
        if (relation?.status !== 'pending') {
            throw new ApiError(404, 'No pending request found from this user');
        }
        await this.userRelationRepository.accept(requesterId, userId);
    }

    async refuse(userId: string, requesterId: string): Promise<void> {
        logger.info(`[UserRelationService] User ${userId} wants to refuse request from ${requesterId}`);
        const relation = await this.userRelationRepository.findRelation(requesterId, userId);
        if (relation?.status !== 'pending') {
            throw new ApiError(404, 'No pending request found from this user');
        }
        await this.userRelationRepository.refuse(requesterId, userId);
    }

    async block(blockerId: string, blockedId: string): Promise<void> {
        logger.info(`[UserRelationService] User ${blockerId} wants to block ${blockedId}`);
        if (blockerId === blockedId) {
            throw new ApiError(400, 'You cannot block yourself');
        }
        const blockedUser = await this.userRepository.findById(blockedId);
        if (!blockedUser) {
            throw new ApiError(404, 'User to block not found');
        }
        await this.userRelationRepository.block(blockerId, blockedId);
    }

    async getFriends(userId: string): Promise<any[]> {
        logger.info(`[UserRelationService] User ${userId} requests their friends (as follower)`);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const relations = await this.userRelationRepository.getFollowed(userId);
        const friendIds = relations
            .filter(r => r.follower_id === userId && r.status === 'accepted')
            .map(r => r.followed_id);

        if (friendIds.length === 0) {
            return [];
        }

        const friends = await this.userRepository.findByIds(friendIds);
        return friends.map(f => ({ id: f.id, username: f.username, isPublic: f.privacy === 'public' }));
    }

    async getFriendsForOther(userId: string, otherId: string): Promise<any[]> {
        logger.info(`[UserRelationService] User ${userId} requests friends of ${otherId} (as follower)`);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const otherUser = await this.userRepository.findById(otherId);
        if (!otherUser) {
            throw new ApiError(404, 'Other user not found');
        }

        const relations = await this.userRelationRepository.getFollower(otherId);
        logger.info(`[UserRelationService] User ${relations.length} requests friends of ${relations} (as follower)`);

        let visibleRelations = relations
            .filter(r => r.follower_id === otherId && r.status === 'accepted');

        // if (user.role !== 'admin') {
        //     visibleRelations = visibleRelations.filter(r => r.privacy === 'public');
        // }

        const friendIds = visibleRelations.map(r => r.followed_id);
        logger.info(`[UserRelationService] User ${friendIds.length} requests friends of ${friendIds} (as follower)`);

        if (friendIds.length === 0) {
            return [];
        }

        const friends = await this.userRepository.findByIds(friendIds);
        return friends.map(f => ({ id: f.id, username: f.username, isPublic: f.privacy === 'public' }));
    }

    async getPendingRequests(userId: string): Promise<any[]> {
        logger.info(`[UserRelationService] User ${userId} wants to see their pending requests`);
        const relations = await this.userRelationRepository.getPendingRequests(userId);
        const requesterIds = relations.map(r => r.follower_id);
        const requesters = await this.userRepository.findByIds(requesterIds);
        return requesters.map(r => ({ id: r.id, username: r.username }));
    }
}