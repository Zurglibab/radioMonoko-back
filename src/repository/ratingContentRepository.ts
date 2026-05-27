import { RatingContent } from '../interfaces/ratingContentInterface';
import { CreateRatingContentDTO, UpdateRatingContentDTO } from '../DTO/ratingContentDTO';

export interface RatingContentRepository {
  findAll(): Promise<RatingContent[]>;
  findByKeys(contentId: string, userId: string): Promise<RatingContent | null>;
  create(rating: CreateRatingContentDTO): Promise<RatingContent>;
  updateByKeys(contentId: string, userId: string, rating: UpdateRatingContentDTO): Promise<RatingContent | null>;
  deleteByKeys(contentId: string, userId: string): Promise<RatingContent | null>;
}