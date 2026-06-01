import { Request, Response } from 'express';
import { ContentFavoriteService } from '../services/contentFavoriteService';
import { applyPaginationHeaders, parsePagination } from '../utils/pagination';

export class ContentFavoriteController {
  constructor(private readonly service: ContentFavoriteService) {}

  getByKeys = async (req: Request, res: Response) => {
    try {
      const favorite = await this.service.getByKeys(req.params.contentId as string, req.params.userId as string);
      if (!favorite) {
        return res.status(404).json({ message: 'Content favorite not found' });
      }
      res.status(200).json(favorite);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getByUserId = async (req: Request, res: Response) => {
    try {
      const pagination = parsePagination(req.query);
      const favorites = await this.service.getByUserId(req.params.userId as string, pagination);
      applyPaginationHeaders(res, pagination, favorites);
      res.status(200).json(favorites);
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

  deleteByKeys = async (req: Request, res: Response) => {
    try {
      const deleted = await this.service.deleteByKeys(req.params.contentId as string, req.params.userId as string);
      if (!deleted) {
        return res.status(404).json({ message: 'Content favorite not found' });
      }
      res.status(200).json(deleted);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}

