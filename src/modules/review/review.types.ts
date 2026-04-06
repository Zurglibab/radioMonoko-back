export interface Review {
    id: string;
    user_id: string;
    content_id: string;
    comment?: string | null;
    created_at: Date;
}

