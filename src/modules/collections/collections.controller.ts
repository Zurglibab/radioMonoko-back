import { Request, Response } from 'express';
import { CollectionsService } from './collections.service';
import { UpdateCollectionDTO } from './collections.dto';

export class CollectionsController {
    constructor(private readonly service: CollectionsService) {}

    getAll = async (_req: Request, res: Response) => {
        try {
            const data = await this.service.getAll();
            res.status(200).json(data);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const collection = await this.service.getById(req.params.id as string);
            if (!collection) {
                return res.status(404).json({ message: 'Collection not found' });
            }
            res.status(200).json(collection);
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
            const updated = await this.service.updateById(req.params.id as string, req.body as UpdateCollectionDTO);
            if (!updated) {
                return res.status(404).json({ message: 'Collection not found' });
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
                return res.status(404).json({ message: 'Collection not found' });
            }
            res.status(200).json(deleted);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    findByUserId = async (req: Request, res: Response) => {
        try {
            const data = await this.service.findByUserId(req.params.userId as string);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(500).json({message: error.message});
        }
    }
}

