import { FeedDAO, feedDAO } from '../DAO/feedDAO';
import { FeedItem } from '../interfaces/feedInterface';
import { UserRelationRepository } from '../repository/userRelationRepository';
export class FeedService {
  constructor(
  private readonly userRelationRepository: UserRelationRepository,
  private readonly feedRepository: FeedDAO = feedDAO)
  {}
  async getFeed(userId: string, limit = 250): Promise<FeedItem[]> {
    if (!userId) {
      throw new Error('userId is required');
    }
    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(Math.floor(limit), 1), 250) : 250;
    const followed = await this.userRelationRepository.getFollowing(userId);
    const followedIds = followed.map((relation) => relation.followed_id);
    return this.feedRepository.findByFollowedUserIds(followedIds, safeLimit);
  }
}