import { Request, Response } from 'express';
import { ReportReviewService } from '../services/reportReviewService';
import { parsePagination, applyPaginationHeaders } from '../utils/pagination';

export class ReportReviewController {
  constructor(private readonly service: ReportReviewService = new ReportReviewService()) {}

  async createReport(req: Request, res: Response) {
    try {
      const { review_id, report_type, description } = req.body;
      const reporter_id = req.userId;

      if (!reporter_id) {
        return res.status(401).json({ message: 'Non authentifié' });
      }
      if (!review_id || !report_type) {
        return res.status(400).json({ message: 'review_id et report_type sont requis' });
      }

      const report = await this.service.createReport({
        reporter_id,
        review_id,
        report_type,
        description
      });
      return res.status(201).json(report);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAllReports(req: Request, res: Response) {
    try {
      const pagination = parsePagination(req.query);
      const limit = pagination?.limit || 50;
      const offset = pagination?.offset || 0;
      const result = await this.service.getAllReports(limit, offset);
      
      applyPaginationHeaders(res, pagination, result.data);
      return res.status(200).json(result.data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getReportsByReviewId(req: Request, res: Response) {
    try {
      const reviewId = req.params.reviewId as string;
      if (!reviewId) {
        return res.status(400).json({ message: 'reviewId est requis' });
      }

      const pagination = parsePagination(req.query);
      const limit = pagination?.limit || 50;
      const offset = pagination?.offset || 0;
      const result = await this.service.getReportsByReviewId(reviewId, limit, offset);

      applyPaginationHeaders(res, pagination, result.data);
      return res.status(200).json(result.data);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteReportById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      if (!id) {
        return res.status(400).json({ message: 'id est requis' });
      }
      const success = await this.service.deleteReportById(id);
      if (!success) {
        return res.status(404).json({ message: 'Signalement non trouvé' });
      }
      return res.status(200).json({ message: 'Signalement supprimé avec succès' });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteReportsByReviewId(req: Request, res: Response) {
    try {
      const reviewId = req.params.reviewId as string;
      if (!reviewId) {
        return res.status(400).json({ message: 'reviewId est requis' });
      }
      const success = await this.service.deleteReportsByReviewId(reviewId);
      // even if false, could mean there were no reports
      return res.status(200).json({ message: 'Signalements supprimés avec succès' });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export const reportReviewController = new ReportReviewController();
