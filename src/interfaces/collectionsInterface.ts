import { CollectionStatus } from '../enums/collectionStatusEnum';

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  is_public: boolean;
  status: CollectionStatus;
  created_at: Date;
}