import { Router } from 'express';
import { CollectionItemsBDDRepository } from './collectionItems.bdd.repository';
import { CollectionItemsService } from './collectionItems.service';
import { CollectionItemsController } from './collectionItems.controller';

export const createCollectionItemsRouter = () => {
    const router = Router();
    const repository = new CollectionItemsBDDRepository();
    const service = new CollectionItemsService(repository);
    const controller = new CollectionItemsController(service);

    router.get('/', controller.getAll);
    router.get('/collection/:collectionId', controller.getByCollectionId);
    router.get('/collection/:collectionId/content/:contentId', controller.getByKeys);
    router.post('/', controller.create);
    router.put('/collection/:collectionId/content/:contentId', controller.updateByKeys);
    router.delete('/collection/:collectionId/content/:contentId', controller.deleteByKeys);

    return router;
};

export default createCollectionItemsRouter;

