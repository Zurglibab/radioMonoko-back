export interface Notification {
    id: string;
    user_id: string;
    type: string;
    message: string;
    is_read: boolean;
    created_at: Date;
    updated_at: Date;
}

