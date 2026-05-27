import { Request, Response } from 'express';
import logger from '../config/logger';
import { FeedService } from '../services/feedService';
export class FeedController {
  constructor(private readonly feedService: FeedService) {}
  getMyFeed = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id || (req as any).userId;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Non autorise.' });
        return;
      }
      const limitParam = req.query.limit;
      const parsedLimit = typeof limitParam === 'string' ? Number(limitParam) : undefined;
      const data = await this.feedService.getFeed(userId, parsedLimit ?? 250);
      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
      return;
    } catch (error: any) {
      logger.error('[FeedController] getMyFeed failed:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
      return;
    }
  };
}