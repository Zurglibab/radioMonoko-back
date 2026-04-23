import { Notification } from '../interfaces/notificationInterface';
import { CreateNotificationDTO, UpdateNotificationDTO } from '../DTO/notificationDTO';

export interface NotificationRepository {
    findAll(): Promise<Notification[]>;
    findById(id: string): Promise<Notification | null>;
    findByUserId(userId: string): Promise<Notification[]>;
    findUnreadByUserId(userId: string): Promise<Notification[]>;
    create(notification: CreateNotificationDTO): Promise<Notification>;
    updateById(id: string, notification: UpdateNotificationDTO): Promise<Notification | null>;
    markAsRead(id: string): Promise<Notification | null>;
    deleteById(id: string): Promise<Notification | null>;
}

