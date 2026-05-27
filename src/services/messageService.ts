import { randomUUID } from 'node:crypto';
import { MessageRepository } from '../repository/messageRepository';
import { Message, UpdateMessageDTO } from '../DTO/messageDTO';
import { ChannelService } from './channelService';

export class MessageService {
    constructor(
        private readonly repository: MessageRepository,
        private readonly channelService: ChannelService,
    ) {}

    async listByChannelId(channelId: string, limit = 50, before?: string): Promise<Message[]> {
        const channel = await this.channelService.findById(channelId);
        if (!channel) throw new Error('Channel not found');

        const beforeDate = before ? new Date(before) : undefined;
        return this.repository.findByChannelId(channelId, limit, beforeDate);
    }

    async createInChannel(channelId: string, senderId: string, content: string): Promise<Message> {
        const channel = await this.channelService.findById(channelId);
        if (!channel) throw new Error('Channel not found');

        const isMember = await this.channelService.isMember(channelId, senderId);
        if (!isMember) throw new Error('Sender must be a channel member');

        if (!content?.trim()) throw new Error('content is required');

        return this.repository.create({
            id: randomUUID(),
            channel_id: channelId,
            sender_id: senderId,
            content: content.trim(),
        });
    }

    async getById(channelId: string, messageId: string): Promise<Message | null> {
        const msg = await this.repository.findById(messageId);
        if (!msg) return null;
        if (msg.channel_id !== channelId) return null;
        return msg;
    }

    async updateById(channelId: string, messageId: string, dto: UpdateMessageDTO): Promise<Message | null> {
        const existing = await this.getById(channelId, messageId);
        if (!existing) return null;

        if (dto.content !== undefined && dto.content.trim() === '') {
            throw new Error('content cannot be empty');
        }

        return this.repository.updateById(messageId, { content: dto.content?.trim() });
    }

    async deleteById(channelId: string, messageId: string): Promise<Message | null> {
        const existing = await this.getById(channelId, messageId);
        if (!existing) return null;
        return this.repository.deleteById(messageId);
    }
}
