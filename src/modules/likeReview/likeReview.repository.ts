import { UpsertLikeReviewDTO } from './likeReview.dto';
import { LikeReview, LikeReviewCount } from './likeReview.types';

export interface LikeReviewRepository {
    upsert(dto: UpsertLikeReviewDTO): Promise<LikeReview>;
    deleteByReviewIdAndUserId(reviewId: string, userId: string): Promise<LikeReview | null>;
    findByReviewId(reviewId: string): Promise<LikeReview[]>;
    countByReviewId(reviewId: string): Promise<LikeReviewCount>;
}

