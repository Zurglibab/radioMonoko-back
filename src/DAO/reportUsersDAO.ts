import { pool } from '../database/db';
import { CreateReportUserDTO, ReportUser } from '../DTO/reportUserDTO';
import { PaginationOptions } from '../utils/pagination';

export class ReportUsersDAO {
  async create(dto: CreateReportUserDTO): Promise<ReportUser> {
    const result = await pool.query(
      `INSERT INTO report_users (reporter_id, reported_user_id, report_type, description)
			 VALUES ($1, $2, $3, $4) RETURNING id, reporter_id, reported_user_id, report_type, description, created_at`,
      [dto.reporter_id, dto.reported_user_id, dto.report_type, dto.description || null]
    );

    return result.rows[0];
  }

  async countByReportedUserId(reportedUserId: string): Promise<number> {
    const result = await pool.query('SELECT COUNT(*) as c FROM report_users WHERE reported_user_id = $1', [reportedUserId]);
    return Number(result.rows[0].c || 0);
  }

  async findByReportedUserId(reportedUserId: string, pagination?: PaginationOptions) {
    const query = pagination
      ? 'SELECT * FROM report_users WHERE reported_user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3'
      : 'SELECT * FROM report_users WHERE reported_user_id = $1 ORDER BY created_at DESC';
    const params = pagination ? [reportedUserId, pagination.limit, pagination.offset] : [reportedUserId];
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findAll(pagination?: PaginationOptions): Promise<ReportUser[]> {
    const query = pagination
      ? 'SELECT * FROM report_users ORDER BY created_at DESC LIMIT $1 OFFSET $2'
      : 'SELECT * FROM report_users ORDER BY created_at DESC';
    const params = pagination ? [pagination.limit, pagination.offset] : [];
    const result = await pool.query(query, params);
    return result.rows;
  }
}

export const reportUsersDAO = new ReportUsersDAO();