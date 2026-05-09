import { Request, Response } from 'express';
import { reportUserService } from '../services/reportUserService';

export class ReportUserController {
	async createReport(req: Request, res: Response) {
		try {
			const reporterId = (req as any).userId as string;
			const { reported_user_id, report_type, description } = req.body;
			if (!reported_user_id || !report_type) {
				return res.status(400).json({ message: 'reported_user_id and report_type are required' });
			}

			const created = await reportUserService.createReport(reporterId, { reported_user_id, report_type, description });
			return res.status(201).json({ success: true, data: created });
		} catch (err: any) {
			console.error('[ReportUserController] createReport failed:', err);
			if (err.message && err.message.includes('not found')) {
				return res.status(404).json({ success: false, error: err.message });
			}
			return res.status(500).json({ success: false, error: 'Internal server error' });
		}
	}
}

export const reportUserController = new ReportUserController();


