import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { UserRelationController } from '../controllers/userRelation.controller';
import { UserRelationService } from '../services/userRelationService';
import { UserRelationRepository } from '../repository/userRelationRepository';
import { UserRelationDAO } from '../DAO/userRelationDAO';
import { UserBDDRepository } from '../bddRepository/user.bdd.repository';

const userRelationRouter = Router();

const userRepository = new UserBDDRepository();

const userRelationDAO = new UserRelationDAO();
const userRelationRepository = new UserRelationRepository(userRelationDAO);
const userRelationService = new UserRelationService(userRelationRepository, userRepository);
const userRelationController = new UserRelationController(userRelationService);
















userRelationRouter.get('/friends', authMiddleware, userRelationController.getFriends);



























userRelationRouter.get('/friends/:id', authMiddleware, userRelationController.getFriends);
















userRelationRouter.get('/request', authMiddleware, userRelationController.getPendingRequests);



























userRelationRouter.post('/follow/:id', authMiddleware, userRelationController.follow);

























userRelationRouter.delete('/unfollow/:id', authMiddleware, userRelationController.unfollow);



























userRelationRouter.patch('/accept/:id', authMiddleware, userRelationController.accept);



























userRelationRouter.patch('/refuse/:id', authMiddleware, userRelationController.refuse);

























userRelationRouter.post('/block/:id', authMiddleware, userRelationController.block);

export default userRelationRouter;