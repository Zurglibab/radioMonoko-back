export interface CreateChannelDTO {
    id: string;
    type: string;
}

export interface UpdateChannelDTO {
    type?: string;
}

export interface AddChannelMemberDTO {
    channel_id: string;
    user_id: string;
}
