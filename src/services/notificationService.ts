import { randomUUID } from 'node:crypto';
import { NotificationRepository } from '../repository/notificationRepository';
import { Notification } from '../interfaces/notificationInterface';
import { CreateNotificationDTO, UpdateNotificationDTO } from '../DTO/notificationDTO';
import { PaginationOptions } from '../utils/pagination';
import { UserDAO } from '../DAO/userDAO';
import { sendMail } from '../utils/mailer';
import logger from '../config/logger';
import { notificationEmailTemplate } from '../utils/emailTemplates';

export class NotificationService {
  constructor(private readonly repository: NotificationRepository) { }

  getAll(pagination?: PaginationOptions): Promise<Notification[]> {
    return this.repository.findAll(pagination);
  }

  getById(id: string): Promise<Notification | null> {
    return this.repository.findById(id);
  }

  getByUserId(userId: string, pagination?: PaginationOptions): Promise<Notification[]> {
    return this.repository.findByUserId(userId, pagination);
  }

  getUnreadByUserId(userId: string, pagination?: PaginationOptions): Promise<Notification[]> {
    return this.repository.findUnreadByUserId(userId, pagination);
  }

  async create(dto: Omit<CreateNotificationDTO, 'id'>): Promise<Notification> {
    if (!dto.user_id || !dto.type || !dto.message) {
      throw new Error('user_id, type and message are required');
    }

    const notification = await this.repository.create({
      id: randomUUID(),
      user_id: dto.user_id,
      type: dto.type,
      message: dto.message,
      is_read: dto.is_read ?? false
    });

    // Envoi d'un email si l'utilisateur a activé notifications_email
    (async () => {
      try {
        const userDao = new UserDAO();
        const user = await userDao.findById(dto.user_id);
        if (!user) return;
        const wantsEmail = (user as any).notifications_email ?? false;
        if (!wantsEmail) return;

        const to = (user as any).email;
        const subject = `Nouvelle notification: ${dto.type}`;
        const frontendBase = process.env.FRONTEND_URL || 'http://localhost:3000';
        const ctaUrl = `${frontendBase}/notifications`;
        const { html, text } = notificationEmailTemplate({
          appName: 'RadioMonoko',
          title: `Nouvelle notification: ${dto.type}`,
          message: dto.message,
          ctaLabel: 'Voir mes notifications',
          ctaUrl,
          footerNote: 'Vous recevez cet email parce que vous avez activé les notifications par email.'
        });
        // sendMail peut lever; on capture et log
        await sendMail(to, subject, text, html);
      } catch (err: any) {
        logger.error('[NotificationService] Failed to send notification email', err?.message || err);
      }
    })();

    return notification;
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