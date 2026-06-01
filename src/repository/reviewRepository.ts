import { Review } from '../interfaces/reviewInterface';
import { CreateReviewDTO, UpdateReviewDTO } from '../DTO/reviewDTO';
import { PaginationOptions } from '../utils/pagination';

export interface ReviewRepository {
  findAll(pagination?: PaginationOptions): Promise<Review[]>;
  findById(id: string): Promise<Review | null>;
  findByContentId(contentId: string, pagination?: PaginationOptions): Promise<Review[]>;
  findByParentReviewId(parentReviewId: string | null, pagination?: PaginationOptions): Promise<Review[]>;
  create(review: CreateReviewDTO): Promise<Review>;
  updateById(id: string, review: UpdateReviewDTO): Promise<Review | null>;
  deleteById(id: string): Promise<Review | null>;
}