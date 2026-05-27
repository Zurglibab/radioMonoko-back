import { Request, Response } from 'express';
import logger from '../config/logger';
import { MessageService } from '../services/messageService';
import { getIO } from '../websockets/socketRegistry';

export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    getMessagesByChannel = async (req: Request, res: Response): Promise<void> => {
        try {
            const { channelId } = req.params;
            const limit = parseInt(req.query.limit as string) || 50;

            const before = req.query.before
                ? (Array.isArray(req.query.before) ? (req.query.before[0] as string) : (req.query.before as string))
                : undefined;

            const messages = await this.messageService.listByChannelId(channelId as string, limit, before);
            res.status(200).json({ success: true, data: messages });
        } catch (error: any) {
            const { channelId } = req.params;
            logger.error(`Error getting messages for channel ${channelId}: ${error}`);
            const msg = String(error?.message ?? 'Internal server error');
            res.status(msg.includes('not found') ? 404 : 500).json({ success: false, error: msg });
        }
    };

    sendMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const { channelId } = req.params;
            const { content } = req.body;
            const senderId = (req as any).user?.id || req.body.senderId || req.body.authorId;

            if (!content) {
                res.status(400).json({ success: false, error: 'Content is required' });
                return;
            }

            if (!senderId) {
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }

            const message = await this.messageService.createInChannel(channelId as string, senderId, content);

            // Realtime: broadcast aux clients qui ont rejoint channel:{channelId}
            try {
                getIO().to(`channel:${channelId}`).emit('newMessage', message);
                logger.info(`Message sent in channel ${channelId}: ${message.id}`);
            } catch (e) {
                // Socket.IO pas initialisé (ex: tests) -> on ignore
            }

            res.status(201).json({ success: true, data: message });
        } catch (error: any) {
            logger.error(`Error sending message in channel ${req.params.channelId}: ${error}`);
            res.status(400).json({ success: false, error: error?.message ?? 'Internal server error' });
        }
    };

    getMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const { channelId, messageId } = req.params;
            const msg = await this.messageService.getById(channelId as string, messageId as string);
            if (!msg) {
                res.status(404).json({ success: false, error: 'Message not found' });
                return;
            }
            res.status(200).json({ success: true, data: msg });
        } catch (error: any) {
            logger.error(`Error getting message ${req.params.messageId}: ${error}`);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    };

    updateMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const { channelId, messageId } = req.params;
            const { content } = req.body;
            const updated = await this.messageService.updateById(channelId as string, messageId as string, { content });
            if (!updated) {
                res.status(404).json({ success: false, error: 'Message not found' });
                return;
            }
            res.status(200).json({ success: true, data: updated });
        } catch (error: any) {
            logger.error(`Error updating message ${req.params.messageId}: ${error}`);
            res.status(400).json({ success: false, error: error?.message ?? 'Bad request' });
        }
    };

    deleteMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const { channelId, messageId } = req.params;
            const deleted = await this.messageService.deleteById(channelId as string, messageId as string);
            if (!deleted) {
                res.status(404).json({ success: false, error: 'Message not found' });
                return;
            }
            res.status(200).json({ success: true, data: deleted });
        } catch (error: any) {
            logger.error(`Error deleting message ${req.params.messageId}: ${error}`);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    };
}
