import { Request, Response } from 'express';
import { ContentStatusService } from '../services/contentStatusService';

export class ContentStatusController {
  constructor(private readonly service: ContentStatusService) {}

  getByKeys = async (req: Request, res: Response) => {
    try {
      const status = await this.service.getByKeys(req.params.contentId as string, req.params.userId as string);
      if (!status) {
        return res.status(404).json({ message: 'Content status not found' });
      }
      res.status(200).json(status);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  upsert = async (req: Request, res: Response) => {
    try {
      const upserted = await this.service.upsert(req.body);
      res.status(200).json(upserted);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}

