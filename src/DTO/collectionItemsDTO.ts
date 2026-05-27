export interface CreateCollectionItemDTO {
  collection_id: string;
  content_id: string;
  position?: number;
  note?: string | null;
}

export interface UpdateCollectionItemDTO {
  position?: number;
  note?: string | null;
}