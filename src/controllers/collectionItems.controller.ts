import { Request, Response } from 'express';
import { CollectionItemsService } from '../services/collectionItemsService';
import { UpdateCollectionItemDTO } from '../DTO/collectionItemsDTO';

export class CollectionItemsController {
  constructor(private readonly service: CollectionItemsService) {}

  getAll = async (_req: Request, res: Response) => {
    try {
      const data = await this.service.getAll();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getByCollectionId = async (req: Request, res: Response) => {
    try {
      const data = await this.service.getByCollectionId(req.params.collectionId as string);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getByKeys = async (req: Request, res: Response) => {
    try {
      const data = await this.service.getByKeys(req.params.collectionId as string, req.params.contentId as string);
      if (!data) {
        return res.status(404).json({ message: 'Collection item not found' });
      }
      res.status(200).json(data);
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
      const updated = await this.service.updateByKeys(req.params.collectionId as string, req.params.contentId as string, req.body as UpdateCollectionItemDTO);
      if (!updated) {
        return res.status(404).json({ message: 'Collection item not found' });
      }
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteByKeys = async (req: Request, res: Response) => {
    try {
      const deleted = await this.service.deleteByKeys(req.params.collectionId as string, req.params.contentId as string);
      if (!deleted) {
        return res.status(404).json({ message: 'Collection item not found' });
      }
      res.status(200).json(deleted);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}