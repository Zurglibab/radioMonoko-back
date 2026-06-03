import { ContentStatus } from '../enums/contentStatusEnum';

import { Content } from '../interfaces/contentInterface';

export interface UpsertContentStatusDTO {
  content_id: string;
  user_id: string;
  status: ContentStatus;
}

export interface LibraryItemDTO {
  content_id: string;
  user_id: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  content: Content;
}

