export interface CreateRatingContentDTO {
    content_id: string;
    user_id: string;
    average_rating: number;
}

export interface UpdateRatingContentDTO {
    average_rating: number;
}

