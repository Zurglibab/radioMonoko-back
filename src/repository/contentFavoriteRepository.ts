import { ContentFavorite } from '../interfaces/contentFavoriteInterface';
import { CreateContentFavoriteDTO } from '../DTO/contentFavoriteDTO';
import { PaginationOptions } from '../utils/pagination';

export interface ContentFavoriteRepository {
  findByKeys(contentId: string, userId: string): Promise<ContentFavorite | null>;
  findByUserId(userId: string, pagination?: PaginationOptions): Promise<ContentFavorite[]>;
  create(favorite: CreateContentFavoriteDTO): Promise<ContentFavorite>;
  deleteByKeys(contentId: string, userId: string): Promise<ContentFavorite | null>;
}

