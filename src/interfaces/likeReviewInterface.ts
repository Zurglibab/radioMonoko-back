export interface LikeReview {
    review_id: string;
    user_id: string;
    is_like: boolean;
    created_at: Date;
}

export interface LikeReviewCount {
    likes: number;
    dislikes: number;
    total: number;
}

