import { Review } from './review.types';
import { CreateReviewDTO, UpdateReviewDTO } from './review.dto';

export interface ReviewRepository {
    findAll(): Promise<Review[]>;
    findById(id: string): Promise<Review | null>;
    findByContentId(contentId: string): Promise<Review[]>;
    create(review: CreateReviewDTO): Promise<Review>;
    updateById(id: string, review: UpdateReviewDTO): Promise<Review | null>;
    deleteById(id: string): Promise<Review | null>;
}

