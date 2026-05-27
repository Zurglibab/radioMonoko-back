import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { reportUserController } from '../controllers/reportUser.controller';

const router = Router();































router.post('/users', authMiddleware, (req, res) => reportUserController.createReport(req, res));

export default router;