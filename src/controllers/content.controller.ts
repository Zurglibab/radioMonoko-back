import { Request, Response } from 'express';
import { ContentService } from '../services/contentService';
import { UpdateContentDTO } from '../DTO/contentDTO';
import { applyPaginationHeaders, parsePagination } from '../utils/pagination';

export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const pagination = parsePagination(req.query);
      const contents = await this.contentService.getAll(pagination);
      applyPaginationHeaders(res, pagination, contents);
      res.status(200).json(contents);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const content = await this.contentService.getById(req.params.id as string);
      if (!content) {
        return res.status(404).json({ message: 'Content not found' });
      }
      res.status(200).json(content);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const created = await this.contentService.create(req.body);
      res.status(201).json(created);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  updateById = async (req: Request, res: Response) => {
    try {
      const updated = await this.contentService.updateById(req.params.id as string, req.body as UpdateContentDTO);
      if (!updated) {
        return res.status(404).json({ message: 'Content not found' });
      }
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteById = async (req: Request, res: Response) => {
    try {
      const deleted = await this.contentService.deleteById(req.params.id as string);
      if (!deleted) {
        return res.status(404).json({ message: 'Content not found' });
      }
      res.status(200).json(deleted);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}