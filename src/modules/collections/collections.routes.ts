import { Router } from 'express';
import { CollectionsBDDRepository } from './collections.bdd.repository';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';

export const createCollectionsRouter = () => {
    const router = Router();
    const repository = new CollectionsBDDRepository();
    const service = new CollectionsService(repository);
    const controller = new CollectionsController(service);

    router.get('/', controller.getAll);
    router.get('/:id', controller.getById);
    router.post('/', controller.create);
    router.put('/:id', controller.updateById);
    router.delete('/:id', controller.deleteById);

    return router;
};

export default createCollectionsRouter;
