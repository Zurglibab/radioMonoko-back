export interface CreateReviewDTO {
    id: string;
    user_id: string;
    content_id: string;
    comment?: string | null;
}

export interface UpdateReviewDTO {
    comment?: string | null;
}
