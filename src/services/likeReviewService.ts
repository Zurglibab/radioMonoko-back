import { LikeReviewRepository } from '../repository/likeReviewRepository';
import { UpsertLikeReviewDTO } from '../DTO/likeReviewDTO';
import { LikeReview, LikeReviewCount } from '../interfaces/likeReviewInterface';

export class LikeReviewService {
  constructor(private readonly repository: LikeReviewRepository) {}

  async upsert(dto: UpsertLikeReviewDTO): Promise<LikeReview> {
    if (!dto.review_id || !dto.user_id || typeof dto.is_like !== 'boolean') {
      throw new Error('review_id, user_id and is_like are required');
    }

    return this.repository.upsert(dto);
  }

  deleteByReviewIdAndUserId(reviewId: string, userId: string): Promise<LikeReview | null> {
    if (!reviewId || !userId) {
      throw new Error('reviewId and userId are required');
    }

    return this.repository.deleteByReviewIdAndUserId(reviewId, userId);
  }

  getByReviewId(reviewId: string): Promise<LikeReview[]> {
    if (!reviewId) {
      throw new Error('reviewId is required');
    }

    return this.repository.findByReviewId(reviewId);
  }

  getCountByReviewId(reviewId: string): Promise<LikeReviewCount> {
    if (!reviewId) {
      throw new Error('reviewId is required');
    }

    return this.repository.countByReviewId(reviewId);
  }
}