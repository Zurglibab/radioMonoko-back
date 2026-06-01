import { RatingContentRepository } from '../repository/ratingContentRepository';
import { RatingContent, RatingContentSummary } from '../interfaces/ratingContentInterface';
import { CreateRatingContentDTO, UpdateRatingContentDTO } from '../DTO/ratingContentDTO';
import logger from '../config/logger';
import { PaginationOptions } from '../utils/pagination';

export class RatingContentService {
  constructor(private readonly repository: RatingContentRepository) {}

  async getAll(pagination?: PaginationOptions): Promise<RatingContent[]> {
    return this.repository.findAll(pagination);
  }

  async getByKeys(contentId: string, userId: string): Promise<RatingContent | null> {
    return this.repository.findByKeys(contentId, userId);
  }

  async getSummaryByContentId(contentId: string): Promise<RatingContentSummary | null> {
    return this.repository.findSummaryByContentId(contentId);
  }

  async create(dto: CreateRatingContentDTO): Promise<RatingContent> {
    if (!dto.content_id || !dto.user_id || dto.average_rating === undefined || dto.average_rating === null) {
      throw new Error('content_id, user_id and average_rating are required');
    }

    if (Number.isNaN(Number(dto.average_rating)) || Number(dto.average_rating) < 0 || Number(dto.average_rating) > 5) {
      throw new Error('average_rating must be a number between 0 and 5');
    }

    logger.info(`Creating rating for content ${dto.content_id} and user ${dto.user_id}`);
    return this.repository.create({
      content_id: dto.content_id,
      user_id: dto.user_id,
      average_rating: Number(dto.average_rating)
    });
  }

  async updateByKeys(contentId: string, userId: string, dto: UpdateRatingContentDTO): Promise<RatingContent | null> {
    if (dto.average_rating === undefined || dto.average_rating === null) {
      throw new Error('average_rating is required');
    }

    if (Number.isNaN(Number(dto.average_rating)) || Number(dto.average_rating) < 0 || Number(dto.average_rating) > 5) {
      throw new Error('average_rating must be a number between 0 and 5');
    }

    return this.repository.updateByKeys(contentId, userId, { average_rating: Number(dto.average_rating) });
  }

  async deleteByKeys(contentId: string, userId: string): Promise<RatingContent | null> {
    return this.repository.deleteByKeys(contentId, userId);
  }
}