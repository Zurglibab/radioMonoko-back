import { pool } from '../database/db';
import { CreateReportUserDTO, ReportUser } from '../DTO/reportUserDTO';

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

	async findByReportedUserId(reportedUserId: string) {
		const result = await pool.query('SELECT * FROM report_users WHERE reported_user_id = $1 ORDER BY created_at DESC', [reportedUserId]);
		return result.rows;
	}
}

export const reportUsersDAO = new ReportUsersDAO();


