import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';
import { UpdateNotificationDTO } from '../DTO/notificationDTO';

export class NotificationController {
    constructor(private readonly service: NotificationService) {}

    getAll = async (_req: Request, res: Response) => {
        try {
            const notifications = await this.service.getAll();
            res.status(200).json(notifications);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const notification = await this.service.getById(req.params.id as string);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.status(200).json(notification);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    getByUserId = async (req: Request, res: Response) => {
        try {
            const notifications = await this.service.getByUserId(req.params.userId as string);
            res.status(200).json(notifications);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    getUnreadByUserId = async (req: Request, res: Response) => {
        try {
            const notifications = await this.service.getUnreadByUserId(req.params.userId as string);
            res.status(200).json(notifications);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const created = await this.service.create(req.body);
            res.status(201).json(created);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    updateById = async (req: Request, res: Response) => {
        try {
            const updated = await this.service.updateById(req.params.id as string, req.body as UpdateNotificationDTO);
            if (!updated) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.status(200).json(updated);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    markAsRead = async (req: Request, res: Response) => {
        try {
            const updated = await this.service.markAsRead(req.params.id as string);
            if (!updated) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.status(200).json(updated);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    deleteById = async (req: Request, res: Response) => {
        try {
            const deleted = await this.service.deleteById(req.params.id as string);
            if (!deleted) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.status(200).json(deleted);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}

