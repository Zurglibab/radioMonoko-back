import { ContentStatus } from '../enums/contentStatusEnum';

export interface UpsertContentStatusDTO {
  content_id: string;
  user_id: string;
  status: ContentStatus;
}

