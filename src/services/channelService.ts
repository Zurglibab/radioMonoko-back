import { randomUUID } from 'node:crypto';
import { ChannelRepository } from '../repository/channelRepository';
import { Channel, ChannelMember } from '../interfaces/channelInterface';

export class ChannelService {
    constructor(private readonly repository: ChannelRepository) {}

    findAll(): Promise<Channel[]> {
        return this.repository.findAll();
    }

    findById(id: string): Promise<Channel | null> {
        return this.repository.findById(id);
    }

    findByUser(userId: string): Promise<Channel[]> {
        return this.repository.findByUserId(userId);
    }

    async create(dto: { type?: string }): Promise<Channel> {
        const type = dto.type?.trim();
        if (!type) {
            throw new Error('type is required');
        }

        return this.repository.create({
            id: randomUUID(),
            type,
        });
    }

    updateById(id: string, dto: { type?: string }): Promise<Channel | null> {
        return this.repository.updateById(id, { type: dto.type });
    }

    deleteById(id: string): Promise<Channel | null> {
        return this.repository.deleteById(id);
    }

    addMember(channelId: string, userId: string): Promise<ChannelMember> {
        if (!userId) throw new Error('userId is required');
        return this.repository.addMember(channelId, userId);
    }

    listMembers(channelId: string): Promise<ChannelMember[]> {
        return this.repository.listMembers(channelId);
    }

    removeMember(channelId: string, userId: string): Promise<ChannelMember | null> {
        return this.repository.removeMember(channelId, userId);
    }

    isMember(channelId: string, userId: string): Promise<boolean> {
        return this.repository.isMember(channelId, userId);
    }
}
