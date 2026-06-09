import { ReportReviewDAO } from '../DAO/reportReviewDAO';
import { CreateReportReviewDTO, ReportReview } from '../DTO/reportReviewDTO';

export class ReportReviewService {
  constructor(private readonly dao: ReportReviewDAO = new ReportReviewDAO()) {}

  async createReport(report: CreateReportReviewDTO): Promise<ReportReview> {
    if (!report.review_id || !report.report_type) {
      throw new Error('review_id and report_type are required');
    }
    // Ideally we could also check if review exists, but the foreign key constraint will do it
    return this.dao.create(report);
  }

  async getAllReports(limit: number = 50, offset: number = 0) {
    const data = await this.dao.findAll(limit, offset);
    const total = await this.dao.countAll();
    return { data, total, limit, offset };
  }

  async getReportsByReviewId(reviewId: string, limit: number = 50, offset: number = 0) {
    if (!reviewId) {
      throw new Error('reviewId is required');
    }
    const data = await this.dao.findByReviewId(reviewId, limit, offset);
    const total = await this.dao.countByReviewId(reviewId);
    return { data, total, limit, offset };
  }

  async deleteReportById(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('id is required');
    }
    return this.dao.deleteById(id);
  }

  async deleteReportsByReviewId(reviewId: string): Promise<boolean> {
    if (!reviewId) {
      throw new Error('reviewId is required');
    }
    return this.dao.deleteByReviewId(reviewId);
  }
}
