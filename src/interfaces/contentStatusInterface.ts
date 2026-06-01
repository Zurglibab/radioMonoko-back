import { ContentStatus } from '../enums/contentStatusEnum';

export interface ContentStatusRecord {
  content_id: string;
  user_id: string;
  status: ContentStatus;
  created_at: Date;
  updated_at: Date;
}

