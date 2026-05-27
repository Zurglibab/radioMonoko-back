import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { reportUserController } from '../controllers/reportUser.controller';

const router = Router();

/**
 * @openapi
 * /reports/users:
 *   post:
 *     tags:
 *       - Reports
 *     summary: Signaler un utilisateur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reported_user_id:
 *                 type: string
 *               report_type:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Report créé
 *       400:
 *         description: Champs manquants
 *       401:
 *         description: Non authentifié
 */
router.post('/users', authMiddleware, (req, res) => reportUserController.createReport(req, res));

export default router;