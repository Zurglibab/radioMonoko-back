import { Message } from '../DTO/messageDTO';
import { CreateMessageDTO, UpdateMessageDTO } from '../DTO/messageDTO';

export interface MessageRepository {
    findByChannelId(channelId: string, limit: number, before?: Date): Promise<Message[]>;
    findById(messageId: string): Promise<Message | null>;
    create(dto: CreateMessageDTO): Promise<Message>;
    updateById(messageId: string, dto: UpdateMessageDTO): Promise<Message | null>;
    deleteById(messageId: string): Promise<Message | null>;
}
