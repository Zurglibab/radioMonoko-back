import { randomUUID } from 'node:crypto';
import { StationsEnum } from '../enums/stationsEnum';
import { ContentRepository } from '../repository/contentRepository';
import { Content, ContentType } from '../interfaces/contentInterface';
import { CreateContentDTO, UpdateContentDTO } from '../DTO/contentDTO';
import logger from '../config/logger';
import { PaginationOptions } from '../utils/pagination';
import { ShowRepository } from '../repository/showRepository';
import { diffusionRepository } from '../repository/diffusionRepository';
import { brandApiService } from './brandsServices';

export class ContentService {
  private readonly showRepository: ShowRepository;

  constructor(private readonly contentRepository: ContentRepository) {
    this.showRepository = new ShowRepository();
  }

  async getAll(pagination?: PaginationOptions): Promise<Content[]> {
    return this.contentRepository.findAll(pagination);
  }

  async getById(id: string): Promise<Content | null> {
    return this.contentRepository.findById(id);
  }

  async getByApiId(apiId: string): Promise<Content | null> {
    return this.contentRepository.findByApiId(apiId);
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

  /**
   * Resolves an external API identifier (Radio France, etc.) to a Content row.
   * 1. Looks up by api_id in the database.
   * 2. Scans the fast Redis cache across stations for shows and diffusions.
   * 3. Scans the Redis cache for brands.
   * 4. Creates the content row on the fly and returns it.
   */
  async resolveByApiId(apiId: string): Promise<Content | null> {
    // 1) Check the database first
    const existing = await this.contentRepository.findByApiId(apiId);
    if (existing) {
      logger.info(`[ContentService] resolveByApiId: found in DB for api_id=${apiId}`);
      return existing;
    }

    logger.info(`[ContentService] resolveByApiId: not in DB, searching in Redis cache for api_id=${apiId}`);

    let title: string | null = null;
    let description: string | undefined;
    let contentType: ContentType = 'other';

    // 2) Try as a show or diffusion by scanning the FAST LOCAL REDIS CACHE
    // We strictly use getShowsFromRedis to avoid triggering API calls
    const { showApiService } = await import('./showServices');
    for (const station of Object.values(StationsEnum)) {
      try {
        const shows = await showApiService.getShowsFromRedis(station as StationsEnum);
        if (!shows) continue;

        for (const show of shows) {
          if (show.id === apiId) {
            title = show.title;
            description = show.standFirst ?? undefined;
            contentType = 'show';
            logger.info(`[ContentService] resolveByApiId: found as show in Redis (station=${station}) for api_id=${apiId}`);
            break;
          }

          const diffusion = show.diffusions?.find((d) => d.id === apiId);
          if (diffusion) {
            title = diffusion.title;
            description = undefined;
            contentType = 'diffusion';
            logger.info(`[ContentService] resolveByApiId: found as diffusion in Redis (station=${station}) for api_id=${apiId}`);
            break;
          }
        }
        if (title) break;
      } catch (err) {
        logger.warn(`[ContentService] resolveByApiId: Redis cache lookup failed for station=${station}`, err);
      }
    }

    // 3) Try brands (from Redis cache)
    if (!title) {
      try {
        const brands = await brandApiService.getBrandsFromRedis();
        if (brands) {
          const brand = brands.find((b) => b.id === apiId);
          if (brand) {
            title = brand.title;
            description = brand.description ?? brand.baseline ?? undefined;
            contentType = 'other';
            logger.info(`[ContentService] resolveByApiId: found as brand in Redis for api_id=${apiId}`);
          }
        }
      } catch (err) {
        logger.warn(`[ContentService] resolveByApiId: brands Redis lookup failed for api_id=${apiId}`, err);
      }
    }

    // 5) If nothing found, return null
    if (!title) {
      logger.info(`[ContentService] resolveByApiId: api_id=${apiId} not found in API or Redis Cache`);
      return null;
    }

    // 6) Create the content row in database
    const newContent = await this.create({
      api_id: apiId,
      title,
      description,
      content_type: contentType
    });

    logger.info(`[ContentService] resolveByApiId: created content id=${newContent.id} for api_id=${apiId}`);
    return newContent;
  }
}