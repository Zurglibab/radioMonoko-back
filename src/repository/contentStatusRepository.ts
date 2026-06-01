simport { ContentStatusRecord } from '../interfaces/contentStatusInterface';
import { UpsertContentStatusDTO } from '../DTO/contentStatusDTO';

export interface ContentStatusRepository {
  findByKeys(contentId: string, userId: string): Promise<ContentStatusRecord | null>;
  upsert(status: UpsertContentStatusDTO): Promise<ContentStatusRecord>;
}

