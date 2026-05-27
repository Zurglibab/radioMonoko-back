export interface Message {
    id: string;
    channel_id: string;
    sender_id: string;
    content: string;
    created_at: Date;
}

export interface CreateMessageDTO {
    id: string;
    channel_id: string;
    sender_id: string;
    content: string;
}

export interface UpdateMessageDTO {
    content?: string;
}
