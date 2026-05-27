import { UpsertLikeReviewDTO } from '../DTO/likeReviewDTO';
import { LikeReview, LikeReviewCount } from '../interfaces/likeReviewInterface';

export interface LikeReviewRepository {
  upsert(dto: UpsertLikeReviewDTO): Promise<LikeReview>;
  deleteByReviewIdAndUserId(reviewId: string, userId: string): Promise<LikeReview | null>;
  findByReviewId(reviewId: string): Promise<LikeReview[]>;
  countByReviewId(reviewId: string): Promise<LikeReviewCount>;
}