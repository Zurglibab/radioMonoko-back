import { pool } from '../database/db';
import { NotificationRepository } from '../repository/notificationRepository';
import { Notification } from '../interfaces/notificationInterface';
import { CreateNotificationDTO, UpdateNotificationDTO } from '../DTO/notificationDTO';

export class NotificationDAO implements NotificationRepository {
  async findAll(): Promise<Notification[]> {
    const result = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id: string): Promise<Notification | null> {
    const result = await pool.query('SELECT * FROM notifications WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const result = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
  }

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    const result = await pool.query('SELECT * FROM notifications WHERE user_id = $1 AND is_read = false ORDER BY created_at DESC', [userId]);
    return result.rows;
  }

  async create(notification: CreateNotificationDTO): Promise<Notification> {
    const result = await pool.query(
      `INSERT INTO notifications (id, user_id, type, message, is_read)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
      [notification.id, notification.user_id, notification.type, notification.message, notification.is_read ?? false]
    );
    return result.rows[0];
  }

  async updateById(id: string, notification: UpdateNotificationDTO): Promise<Notification | null> {
    const current = await this.findById(id);
    if (!current) {
      return null;
    }

    const result = await pool.query(
      `UPDATE notifications
             SET type = COALESCE($2, type),
                 message = COALESCE($3, message),
                 is_read = COALESCE($4, is_read),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
      [id, notification.type ?? null, notification.message ?? null, notification.is_read ?? null]
    );
    return result.rows[0] ?? null;
  }

  async markAsRead(id: string): Promise<Notification | null> {
    const result = await pool.query(
      `UPDATE notifications
             SET is_read = true,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async markAllAsReadByUserId(userId: string): Promise<Notification[]> {
    const result = await pool.query(
      `UPDATE notifications
             SET is_read = true,
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $1 AND is_read = false
             RETURNING *`,
      [userId]
    );
    return result.rows;
  }

  async deleteById(id: string): Promise<Notification | null> {
    const result = await pool.query('DELETE FROM notifications WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] ?? null;
  }
}