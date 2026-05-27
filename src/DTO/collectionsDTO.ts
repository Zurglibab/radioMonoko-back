export interface CreateCollectionDTO {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  is_public?: boolean;
}

export interface UpdateCollectionDTO {
  name?: string;
  description?: string | null;
  is_public?: boolean;
}