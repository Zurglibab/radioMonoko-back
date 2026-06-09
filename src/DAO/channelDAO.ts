import { pool } from '../database/db';
import { ChannelRepository } from '../repository/channelRepository';
import { Channel, ChannelMember } from '../interfaces/channelInterface';
import { CreateChannelDTO, UpdateChannelDTO } from '../DTO/channelDTO';

export class ChannelDAO implements ChannelRepository {
    async findAll(): Promise<Channel[]> {
        const result = await pool.query('SELECT * FROM channel ORDER BY created_at DESC');
        return result.rows;
    }

    async findById(id: string): Promise<Channel | null> {
        const result = await pool.query('SELECT * FROM channel WHERE id = $1', [id]);
        return result.rows[0] ?? null;
    }

    async create(channel: CreateChannelDTO): Promise<Channel> {
        const result = await pool.query(
            `INSERT INTO channel (id, type)
             VALUES ($1, $2)
             RETURNING *`,
            [channel.id, channel.type],
        );
        return result.rows[0];
    }

    async updateById(id: string, dto: UpdateChannelDTO): Promise<Channel | null> {
        const current = await this.findById(id);
        if (!current) return null;

        const result = await pool.query(
            `UPDATE channel
             SET type = COALESCE($2, type)
             WHERE id = $1
             RETURNING *`,
            [id, dto.type ?? null],
        );
        return result.rows[0] ?? null;
    }

    async deleteById(id: string): Promise<Channel | null> {
        const result = await pool.query('DELETE FROM channel WHERE id = $1 RETURNING *', [id]);
        return result.rows[0] ?? null;
    }

    async addMember(channelId: string, userId: string): Promise<ChannelMember> {
        const result = await pool.query(
            `INSERT INTO channel_user (channel_id, user_id)
             VALUES ($1, $2)
             ON CONFLICT (channel_id, user_id) DO UPDATE SET joined_at = channel_user.joined_at
             RETURNING *`,
            [channelId, userId],
        );
        return result.rows[0];
    }

    async listMembers(channelId: string): Promise<ChannelMember[]> {
        const result = await pool.query(
            'SELECT * FROM channel_user WHERE channel_id = $1 ORDER BY joined_at ASC',
            [channelId],
        );
        return result.rows;
    }

    async removeMember(channelId: string, userId: string): Promise<ChannelMember | null> {
        const result = await pool.query(
            'DELETE FROM channel_user WHERE channel_id = $1 AND user_id = $2 RETURNING *',
            [channelId, userId],
        );
        return result.rows[0] ?? null;
    }

    async isMember(channelId: string, userId: string): Promise<boolean> {
        const result = await pool.query(
            'SELECT 1 FROM channel_user WHERE channel_id = $1 AND user_id = $2',
            [channelId, userId],
        );
        return (result.rowCount ?? 0) > 0;
    }

    async findByUserId(userId: string): Promise<Channel[]> {
        const result = await pool.query(
            `SELECT c.*
             FROM channel c
             JOIN channel_user cu ON c.id = cu.channel_id
             WHERE cu.user_id = $1
             ORDER BY c.created_at DESC`,
            [userId],
        );
        return result.rows;
    }
}
