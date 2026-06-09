import { pool } from '../database/db';
import { CreateReportReviewDTO, ReportReview } from '../DTO/reportReviewDTO';

export class ReportReviewDAO {
  async create(report: CreateReportReviewDTO): Promise<ReportReview> {
    const result = await pool.query(
      `INSERT INTO report_reviews (reporter_id, review_id, report_type, description)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
      [report.reporter_id, report.review_id, report.report_type, report.description]
    );
    return result.rows[0];
  }

  async findAll(limit: number, offset: number): Promise<ReportReview[]> {
    const result = await pool.query(
      `SELECT * FROM report_reviews ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  async countAll(): Promise<number> {
    const result = await pool.query(`SELECT COUNT(*) FROM report_reviews`);
    return parseInt(result.rows[0].count, 10);
  }

  async findByReviewId(reviewId: string, limit: number, offset: number): Promise<ReportReview[]> {
    const result = await pool.query(
      `SELECT * FROM report_reviews WHERE review_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [reviewId, limit, offset]
    );
    return result.rows;
  }

  async countByReviewId(reviewId: string): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*) FROM report_reviews WHERE review_id = $1`,
      [reviewId]
    );
    return parseInt(result.rows[0].count, 10);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await pool.query(`DELETE FROM report_reviews WHERE id = $1 RETURNING *`, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async deleteByReviewId(reviewId: string): Promise<boolean> {
    const result = await pool.query(`DELETE FROM report_reviews WHERE review_id = $1 RETURNING *`, [reviewId]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
