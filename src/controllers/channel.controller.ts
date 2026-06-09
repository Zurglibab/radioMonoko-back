import { Request, Response } from 'express';
import { ChannelService } from '../services/channelService';
import logger from "../config/logger";

export class ChannelController {
    constructor(private readonly service: ChannelService) {}

    listChannels = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user?.id as string | undefined;
            const data = await this.service.findByUser(userId);
            if (!data || data.length === 0) return res.status(200).json([]);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    getChannel = async (req: Request, res: Response) => {
        try {
            const channel = await this.service.findById(req.params.channelId as string);
            if (!channel) return res.status(404).json({ message: 'Channel not found' });
            res.status(200).json(channel);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    createChannel = async (req: Request, res: Response) => {
        try {
            // Compat: routes historiques utilisaient name, on mappe -> type
            const type = (req.body?.type ?? req.body?.name) as string | undefined;
            const created = await this.service.create({ type });
            res.status(201).json(created);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    updateChannel = async (req: Request, res: Response) => {
        try {
            const type = (req.body?.type ?? req.body?.name) as string | undefined;
            const updated = await this.service.updateById(req.params.channelId as string, { type });
            if (!updated) return res.status(404).json({ message: 'Channel not found' });
            res.status(200).json(updated);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    deleteChannel = async (req: Request, res: Response) => {
        try {
            const deleted = await this.service.deleteById(req.params.channelId as string);
            if (!deleted) return res.status(404).json({ message: 'Channel not found' });
            res.status(200).json(deleted);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    addMember = async (req: Request, res: Response) => {
        try {
            const { channelId } = req.params;
            const userId = (req.body?.userId ?? req.body?.user_id) as string | undefined;
            if (!userId) return res.status(400).json({ message: 'userId is required' });

            const channel = await this.service.findById(channelId as string);
            if (!channel) return res.status(404).json({ message: 'Channel not found' });

            const member = await this.service.addMember(channelId as string, userId);
            res.status(201).json(member);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    listMembers = async (req: Request, res: Response) => {
        try {
            const { channelId } = req.params;
            const channel = await this.service.findById(channelId as string);
            if (!channel) return res.status(404).json({ message: 'Channel not found' });
            const members = await this.service.listMembers(channelId as string);
            res.status(200).json(members);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    removeMember = async (req: Request, res: Response) => {
        try {
            const { channelId, userId } = req.params;
            const channel = await this.service.findById(channelId as string);
            if (!channel) return res.status(404).json({ message: 'Channel not found' });

            const removed = await this.service.removeMember(channelId as string, userId as string);
            if (!removed) return res.status(404).json({ message: 'Membership not found' });

            res.status(200).json(removed);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}
