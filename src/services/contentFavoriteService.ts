import { ContentFavoriteRepository } from '../repository/contentFavoriteRepository';
import { ContentFavorite } from '../interfaces/contentFavoriteInterface';
import { CreateContentFavoriteDTO } from '../DTO/contentFavoriteDTO';
import { PaginationOptions } from '../utils/pagination';

export class ContentFavoriteService {
  constructor(private readonly repository: ContentFavoriteRepository) {}

  async getByKeys(contentId: string, userId: string): Promise<ContentFavorite | null> {
    return this.repository.findByKeys(contentId, userId);
  }

  async getByUserId(userId: string, pagination?: PaginationOptions): Promise<ContentFavorite[]> {
    return this.repository.findByUserId(userId, pagination);
  }

  async create(dto: CreateContentFavoriteDTO): Promise<ContentFavorite> {
    if (!dto.content_id || !dto.user_id) {
      throw new Error('content_id and user_id are required');
    }

    return this.repository.create(dto);
  }

  async deleteByKeys(contentId: string, userId: string): Promise<ContentFavorite | null> {
    return this.repository.deleteByKeys(contentId, userId);
  }
}

