import { pool } from '../database/db';
import { MessageRepository } from '../repository/messageRepository';
import { Message, CreateMessageDTO, UpdateMessageDTO } from '../DTO/messageDTO';

export class MessageDAO implements MessageRepository {
    async findByChannelId(channelId: string, limit: number, before?: Date): Promise<Message[]> {
        const beforeDate = before ?? new Date();
        const result = await pool.query(
            `SELECT
                 id,
                 channel_id,
                 sender_id,
                 content,
                 created_at
             FROM messages
             WHERE channel_id = $1 AND created_at < $2
             ORDER BY created_at DESC
             LIMIT $3`,
            [channelId, beforeDate, limit],
        );

        return result.rows.reverse();
    }

    async findById(messageId: string): Promise<Message | null> {
        const result = await pool.query(
            `SELECT
                 id,
                 COALESCE(channel_id, room_id) AS channel_id,
                 sender_id,
                 content,
                 created_at
             FROM messages
             WHERE id = $1`,
            [messageId],
        );
        return result.rows[0] ?? null;
    }

    async create(dto: CreateMessageDTO): Promise<Message> {
        const result = await pool.query(
            `INSERT INTO messages (id, channel_id, sender_id, content)
             VALUES ($1, $2, $3, $4)
             RETURNING
                 id,
                 channel_id,
                 sender_id,
                 content,
                 created_at`,
            [dto.id, dto.channel_id, dto.sender_id, dto.content],
        );
        return result.rows[0];
    }

    async updateById(messageId: string, dto: UpdateMessageDTO): Promise<Message | null> {
        const current = await this.findById(messageId);
        if (!current) return null;

        const result = await pool.query(
            `UPDATE messages
             SET content = COALESCE($2, content)
             WHERE id = $1
             RETURNING
                 id,
                 COALESCE(channel_id, room_id) AS channel_id,
                 sender_id,
                 content,
                 created_at`,
            [messageId, dto.content ?? null],
        );
        return result.rows[0] ?? null;
    }

    async deleteById(messageId: string): Promise<Message | null> {
        const result = await pool.query(
            `DELETE FROM messages
             WHERE id = $1
             RETURNING
                 id,
                 COALESCE(channel_id, room_id) AS channel_id,
                 sender_id,
                 content,
                 created_at`,
            [messageId],
        );
        return result.rows[0] ?? null;
    }
}
