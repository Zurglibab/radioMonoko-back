import { ContentStatusRecord } from '../interfaces/contentStatusInterface';
import { UpsertContentStatusDTO } from '../DTO/contentStatusDTO';

export interface ContentStatusRepository {
  findByKeys(contentId: string, userId: string): Promise<ContentStatusRecord | null>;
  findLibraryByUserId(userId: string): Promise<any[]>;
  upsert(status: UpsertContentStatusDTO): Promise<ContentStatusRecord>;
}

