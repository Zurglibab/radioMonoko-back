import { Notification } from '../interfaces/notificationInterface';
import { CreateNotificationDTO, UpdateNotificationDTO } from '../DTO/notificationDTO';
import { PaginationOptions } from '../utils/pagination';

export interface NotificationRepository {
  findAll(pagination?: PaginationOptions): Promise<Notification[]>;
  findById(id: string): Promise<Notification | null>;
  findByUserId(userId: string, pagination?: PaginationOptions): Promise<Notification[]>;
  findUnreadByUserId(userId: string, pagination?: PaginationOptions): Promise<Notification[]>;
  create(notification: CreateNotificationDTO): Promise<Notification>;
  updateById(id: string, notification: UpdateNotificationDTO): Promise<Notification | null>;
  markAsRead(id: string): Promise<Notification | null>;
  markAllAsReadByUserId(userId: string): Promise<Notification[]>;
  deleteById(id: string): Promise<Notification | null>;
}