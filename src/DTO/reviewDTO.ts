export interface CreateReviewDTO {
  id: string;
  user_id: string;
  content_id: string;
  parent_review_id?: string | null;
  comment?: string | null;
}

export interface UpdateReviewDTO {
  parent_review_id?: string | null;
  comment?: string | null;
  is_featured?: boolean;
}