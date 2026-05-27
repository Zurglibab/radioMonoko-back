import { Request, Response } from 'express';
import { RatingContentService } from '../services/ratingContentService';
import { UpdateRatingContentDTO } from '../DTO/ratingContentDTO';

export class RatingContentController {
  constructor(private readonly service: RatingContentService) {}

  getAll = async (_req: Request, res: Response) => {
    try {
      const ratings = await this.service.getAll();
      res.status(200).json(ratings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getByKeys = async (req: Request, res: Response) => {
    try {
      const rating = await this.service.getByKeys(req.params.contentId as string, req.params.userId as string);
      if (!rating) {
        return res.status(404).json({ message: 'Rating not found' });
      }
      res.status(200).json(rating);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const created = await this.service.create(req.body);
      res.status(201).json(created);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  updateByKeys = async (req: Request, res: Response) => {
    try {
      const updated = await this.service.updateByKeys(
        req.params.contentId as string,
        req.params.userId as string,
        req.body as UpdateRatingContentDTO
      );

      if (!updated) {
        return res.status(404).json({ message: 'Rating not found' });
      }

      res.status(200).json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteByKeys = async (req: Request, res: Response) => {
    try {
      const deleted = await this.service.deleteByKeys(req.params.contentId as string, req.params.userId as string);
      if (!deleted) {
        return res.status(404).json({ message: 'Rating not found' });
      }
      res.status(200).json(deleted);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}