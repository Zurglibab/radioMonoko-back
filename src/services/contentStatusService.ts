import { ContentStatusRepository } from '../repository/contentStatusRepository';
import { ContentStatusRecord } from '../interfaces/contentStatusInterface';
import { UpsertContentStatusDTO } from '../DTO/contentStatusDTO';
import { CONTENT_STATUS_VALUES, ContentStatus, isContentStatus } from '../enums/contentStatusEnum';

export class ContentStatusService {
  constructor(private readonly repository: ContentStatusRepository) {}

  getAllStatuses(): ContentStatus[] {
    return [...CONTENT_STATUS_VALUES];
  }

  async getByKeys(contentId: string, userId: string): Promise<ContentStatusRecord | null> {
    return this.repository.findByKeys(contentId, userId);
  }

  async getUserLibrary(userId: string): Promise<any[]> {
    return this.repository.findLibraryByUserId(userId);
  }

  async upsert(dto: UpsertContentStatusDTO): Promise<ContentStatusRecord> {
    if (!dto.content_id || !dto.user_id || !dto.status) {
      throw new Error('content_id, user_id and status are required');
    }

    if (!isContentStatus(dto.status)) {
      throw new Error('status must be one of: à voir, commencer, fini');
    }

    return this.repository.upsert({
      content_id: dto.content_id,
      user_id: dto.user_id,
      status: dto.status as ContentStatus
    });
  }
}

