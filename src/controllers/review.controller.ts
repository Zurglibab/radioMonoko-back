import { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService';
import { UpdateReviewDTO } from '../DTO/reviewDTO';

export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  getAll = async (_req: Request, res: Response) => {
    try {
      const reviews = await this.service.getAll();
      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const review = await this.service.getById(req.params.id as string);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
      res.status(200).json(review);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getByContentId = async (req: Request, res: Response) => {
    try {
      const reviews = await this.service.getByContentId(req.params.contentId as string);
      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getByParentReviewId = async (req: Request, res: Response) => {
    try {
      const parentReviewId = req.params.parentReviewId === 'null' ? null : req.params.parentReviewId as string;
      const reviews = await this.service.getByParentReviewId(parentReviewId);
      res.status(200).json(reviews);
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

  updateById = async (req: Request, res: Response) => {
    try {
      const updated = await this.service.updateById(req.params.id as string, req.body as UpdateReviewDTO);
      if (!updated) {
        return res.status(404).json({ message: 'Review not found' });
      }
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteById = async (req: Request, res: Response) => {
    try {
      const deleted = await this.service.deleteById(req.params.id as string);
      if (!deleted) {
        return res.status(404).json({ message: 'Review not found' });
      }
      res.status(200).json(deleted);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}