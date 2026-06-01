import { RatingContent, RatingContentSummary } from '../interfaces/ratingContentInterface';
import { CreateRatingContentDTO, UpdateRatingContentDTO } from '../DTO/ratingContentDTO';

export interface RatingContentRepository {
  findAll(): Promise<RatingContent[]>;
  findByKeys(contentId: string, userId: string): Promise<RatingContent | null>;
  findSummaryByContentId(contentId: string): Promise<RatingContentSummary | null>;
  create(rating: CreateRatingContentDTO): Promise<RatingContent>;
  updateByKeys(contentId: string, userId: string, rating: UpdateRatingContentDTO): Promise<RatingContent | null>;
  deleteByKeys(contentId: string, userId: string): Promise<RatingContent | null>;
}