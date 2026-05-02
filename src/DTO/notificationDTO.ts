export interface CreateNotificationDTO {
    id: string;
    user_id: string;
    type: string;
    message: string;
    is_read?: boolean;
}

export interface UpdateNotificationDTO {
    type?: string;
    message?: string;
    is_read?: boolean;
}

