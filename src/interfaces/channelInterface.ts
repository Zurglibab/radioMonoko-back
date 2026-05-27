export interface Channel {
    id: string;
    type: string;
    created_at: Date;
}

export interface ChannelMember {
    channel_id: string;
    user_id: string;
    joined_at: Date;
}
