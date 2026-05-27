import { UserRelationDAO } from '../DAO/userRelationDAO';
import { UserRelation } from '../interfaces/userRelationInterface';
import { FollowDTO } from "../DTO/userRelationDTO";

export class UserRelationRepository {
    constructor(private readonly userRelationBddRepository: UserRelationDAO) {}

    async follow(followerId: string, followedId: string): Promise<void> {
        const followDto: FollowDTO = { follower_id: followerId, followed_id: followedId };
        await this.userRelationBddRepository.follow(followDto);
    }

    async unfollow(followerId: string, followedId: string): Promise<void> {
        const followDto: FollowDTO = { follower_id: followerId, followed_id: followedId };
        return this.userRelationBddRepository.unfollow(followDto);
    }

    async accept(followerId: string, followedId: string): Promise<void> {
        const followDto: FollowDTO = { follower_id: followerId, followed_id: followedId };
        await this.userRelationBddRepository.accept(followDto);
    }

    async getFollower(userId: string): Promise<UserRelation[]> {
        return this.userRelationBddRepository.getFollowers(userId);
    }

    async getPendingRequests(userId: string): Promise<UserRelation[]> {
        return this.userRelationBddRepository.getPendingRequests(userId);
    }

    async findRelation(followerId: string, followedId: string): Promise<UserRelation | null> {
        const followDto: FollowDTO = { follower_id: followerId, followed_id: followedId };
        return this.userRelationBddRepository.findRelation(followDto);
    }

    async refuse(followerId: string, followedId: string): Promise<void> {
        const followDto: FollowDTO = { follower_id: followerId, followed_id: followedId };
        await this.userRelationBddRepository.refuse(followDto);
    }

    async block(blockerId: string, blockedId: string): Promise<void> {
        const followDto: FollowDTO = { follower_id: blockerId, followed_id: blockedId };
        await this.userRelationBddRepository.block(followDto);
    }

    async getFollowed(userId: string): Promise<UserRelation[]> {
        return this.userRelationBddRepository.getFollowed(userId);
    }
}