import { Router } from 'express';
import { ContentBDDRepository } from './content.bdd.repository';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';

export const createContentRouter = () => {
    const contentRouter = Router();
    const contentRepository = new ContentBDDRepository();
    const contentService = new ContentService(contentRepository);
    const contentController = new ContentController(contentService);

    contentRouter.get('/', contentController.getAll);
    contentRouter.get('/:id', contentController.getById);
    contentRouter.post('/', contentController.create);
    contentRouter.put('/:id', contentController.updateById);
    contentRouter.delete('/:id', contentController.deleteById);

    return contentRouter;
};

export default createContentRouter;
