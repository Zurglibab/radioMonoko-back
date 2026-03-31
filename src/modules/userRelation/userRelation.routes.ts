import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { UserRelationController } from './userRelation.controller';
import { UserRelationService } from './userRelation.service';
import { UserRelationRepository } from './userRelation.repository';
import { UserRelationBddRepository } from './userRelation.bdd.repository';
import { UserBDDRepository } from '../user/user.bdd.repository';

const userRelationRouter = Router();

const userRepository = new UserBDDRepository();

const userRelationBddRepository = new UserRelationBddRepository();
const userRelationRepository = new UserRelationRepository(userRelationBddRepository);
const userRelationService = new UserRelationService(userRelationRepository, userRepository);
const userRelationController = new UserRelationController(userRelationService);

userRelationRouter.get('/friends', authMiddleware, userRelationController.getFriends);
userRelationRouter.get('/friends/:id', authMiddleware, userRelationController.getFriends);

userRelationRouter.get('/request', authMiddleware,  userRelationController.getPendingRequests);

userRelationRouter.post('/follow/:id', authMiddleware, userRelationController.follow);
userRelationRouter.delete('/unfollow/:id', authMiddleware, userRelationController.unfollow);

userRelationRouter.patch('/accept/:id', authMiddleware, userRelationController.accept);
userRelationRouter.patch('/refuse/:id', authMiddleware, userRelationController.refuse);
userRelationRouter.post('/block/:id', authMiddleware, userRelationController.block);

export default userRelationRouter;
