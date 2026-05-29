import { CollectionStatus } from '../enums/collectionStatusEnum';

export interface CreateCollectionDTO {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  is_public?: boolean;
  status?: CollectionStatus;
}

export interface UpdateCollectionDTO {
  name?: string;
  description?: string | null;
  is_public?: boolean;
  status?: CollectionStatus;
}