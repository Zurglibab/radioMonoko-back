import { randomUUID } from 'node:crypto';
import { ContentRepository } from '../repository/contentRepository';
import { Content } from '../interfaces/contentInterface';
import { CreateContentDTO, UpdateContentDTO } from '../DTO/contentDTO';
import logger from '../config/logger';
import { PaginationOptions } from '../utils/pagination';

export class ContentService {
  constructor(private readonly contentRepository: ContentRepository) {}

  async getAll(pagination?: PaginationOptions): Promise<Content[]> {
    return this.contentRepository.findAll(pagination);
  }

  async getById(id: string): Promise<Content | null> {
    return this.contentRepository.findById(id);
  }

  async create(dto: Omit<CreateContentDTO, 'id'>): Promise<Content> {
    if (!dto.api_id || !dto.title || !dto.content_type) {
      throw new Error('api_id, title and content_type are required');
    }

    const content: CreateContentDTO = {
      id: randomUUID(),
      api_id: dto.api_id,
      title: dto.title,
      description: dto.description,
      content_type: dto.content_type
    };

    logger.info(`Creating content with api_id: ${dto.api_id}`);
    return this.contentRepository.create(content);
  }

  async updateById(id: string, dto: UpdateContentDTO): Promise<Content | null> {
    return this.contentRepository.updateById(id, dto);
  }

  async deleteById(id: string): Promise<Content | null> {
    return this.contentRepository.deleteById(id);
  }
}