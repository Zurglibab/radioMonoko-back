import { randomUUID } from 'node:crypto';
import { NotificationRepository } from '../repository/notificationRepository';
import { Notification } from '../interfaces/notificationInterface';
import { CreateNotificationDTO, UpdateNotificationDTO } from '../DTO/notificationDTO';

export class NotificationService {
  constructor(private readonly repository: NotificationRepository) {}

  getAll(): Promise<Notification[]> {
    return this.repository.findAll();
  }

  getById(id: string): Promise<Notification | null> {
    return this.repository.findById(id);
  }

  getByUserId(userId: string): Promise<Notification[]> {
    return this.repository.findByUserId(userId);
  }

  getUnreadByUserId(userId: string): Promise<Notification[]> {
    return this.repository.findUnreadByUserId(userId);
  }

  async create(dto: Omit<CreateNotificationDTO, 'id'>): Promise<Notification> {
    if (!dto.user_id || !dto.type || !dto.message) {
      throw new Error('user_id, type and message are required');
    }

    return this.repository.create({
      id: randomUUID(),
      user_id: dto.user_id,
      type: dto.type,
      message: dto.message,
      is_read: dto.is_read ?? false
    });
  }

  updateById(id: string, dto: UpdateNotificationDTO): Promise<Notification | null> {
    return this.repository.updateById(id, dto);
  }

  markAsRead(id: string): Promise<Notification | null> {
    return this.repository.markAsRead(id);
  }

  markAllAsReadByUserId(userId: string): Promise<Notification[]> {
    return this.repository.markAllAsReadByUserId(userId);
  }

  deleteById(id: string): Promise<Notification | null> {
    return this.repository.deleteById(id);
  }
}