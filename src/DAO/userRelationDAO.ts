import { pool } from '../database/db';
import { UserRelation } from '../interfaces/userRelationInterface';
import logger  from '../config/logger';
import {FollowDTO} from "../DTO/userRelationDTO";

export class UserRelationDAO {
    async follow(follow : FollowDTO): Promise<void> {
        await pool.query(
            'INSERT INTO user_relations (followed_id, follower_id) VALUES ($1, $2) ON CONFLICT (followed_id, follower_id) DO NOTHING',
            [follow.followed_id, follow.follower_id]
        );
        logger.info(`[UserRelationBddRepository] Following user ${follow.followed_id} from ${follow.follower_id}`);
    }

    async unfollow(follow : FollowDTO): Promise<void> {
        await pool.query(
            'DELETE FROM user_relations WHERE followed_id = $1 AND follower_id = $2',
            [follow.followed_id, follow.follower_id]
        );
        logger.info(`[UserRelationBddRepository] Unfollowing user ${follow.followed_id} from ${follow.follower_id}`);
    }

    async accept(follow : FollowDTO): Promise<void> {
        await pool.query(
            'UPDATE user_relations SET status = \'accepted\' WHERE followed_id = $1 AND follower_id = $2',
            [follow.followed_id, follow.follower_id]
        );
        await pool.query(
            'INSERT INTO user_relations (followed_id, follower_id, status) VALUES ($1, $2, \'accepted\') ON CONFLICT (followed_id, follower_id) DO NOTHING',
            [follow.follower_id, follow.followed_id]
        )
        logger.info(`[UserRelationBddRepository] Accepting follow request from ${follow.follower_id} to ${follow.followed_id}`);
    }

    async refuse(follow : FollowDTO): Promise<void> {
        await pool.query(
            'UPDATE user_relations SET status = \'refused\' WHERE followed_id = $1 AND follower_id = $2',
            [follow.followed_id, follow.follower_id]
        );
        logger.info(`[UserRelationBddRepository] Refusing follow request from ${follow.follower_id} to ${follow.followed_id}`);
    }

    async block(follow : FollowDTO): Promise<void> {
        await pool.query(
            `INSERT INTO user_relations (followed_id, follower_id, status) 
            VALUES ($1, $2, 'blocked') 
            ON CONFLICT (followed_id, follower_id) 
            DO UPDATE SET status = 'blocked'`,
            [follow.followed_id, follow.follower_id]
        );
        logger.info(`[UserRelationBddRepository] Blocking user ${follow.follower_id} from ${follow.followed_id}`);
    }

    async getFollowed(userId: string): Promise<UserRelation[]> {
        const { rows } = await pool.query<UserRelation>(
            'SELECT * FROM user_relations WHERE (followed_id = $1 ) AND status = \'accepted\'',
            [userId]
        );
        logger.info(`[UserRelationBddRepository] Getting friends for user ${userId}`);
        return rows;
    }

    async getFollowers(userId: string): Promise<UserRelation[]> {
        const { rows } = await pool.query<UserRelation>(
            'SELECT * FROM user_relations WHERE (follower_id = $1 ) AND status = \'accepted\'',
            [userId]
        );
        logger.info(`[UserRelationBddRepository] Getting followers for user ${userId}`);
        return rows;
    }

    async getPendingRequests(userId: string): Promise<UserRelation[]> {
        const { rows } = await pool.query<UserRelation>(
            'SELECT * FROM user_relations WHERE followed_id = $1 AND status = \'pending\'',
            [userId]
        );
        logger.info(`[UserRelationBddRepository] Getting pending requests for user ${userId}`);
        return rows;
    }

    async findRelation(follow : FollowDTO): Promise<UserRelation | null> {
        const { rows } = await pool.query<UserRelation>(
            'SELECT * FROM user_relations WHERE followed_id = $1 AND follower_id = $2',
            [follow.followed_id, follow.follower_id]
        );
        logger.info(`[UserRelationBddRepository] Finding relation from ${follow.follower_id} to ${follow.followed_id}`);
        return rows[0] || null;
    }
}