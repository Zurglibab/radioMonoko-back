import { Channel, ChannelMember } from '../interfaces/channelInterface';
import { CreateChannelDTO, UpdateChannelDTO } from '../DTO/channelDTO';

export interface ChannelRepository {
    findAll(): Promise<Channel[]>;
    findById(id: string): Promise<Channel | null>;
    create(channel: CreateChannelDTO): Promise<Channel>;
    updateById(id: string, dto: UpdateChannelDTO): Promise<Channel | null>;
    deleteById(id: string): Promise<Channel | null>;

    addMember(channelId: string, userId: string): Promise<ChannelMember>;
    listMembers(channelId: string): Promise<ChannelMember[]>;
    removeMember(channelId: string, userId: string): Promise<ChannelMember | null>;
    isMember(channelId: string, userId: string): Promise<boolean>;

    findByUserId(userId: string): Promise<Channel[]>;
}
