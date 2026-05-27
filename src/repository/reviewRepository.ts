import { Review } from '../interfaces/reviewInterface';
import { CreateReviewDTO, UpdateReviewDTO } from '../DTO/reviewDTO';

export interface ReviewRepository {
  findAll(): Promise<Review[]>;
  findById(id: string): Promise<Review | null>;
  findByContentId(contentId: string): Promise<Review[]>;
  findByParentReviewId(parentReviewId: string | null): Promise<Review[]>;
  create(review: CreateReviewDTO): Promise<Review>;
  updateById(id: string, review: UpdateReviewDTO): Promise<Review | null>;
  deleteById(id: string): Promise<Review | null>;
}