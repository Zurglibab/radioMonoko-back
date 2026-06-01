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

/**
 * @openapi
 * /reports/users:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Récupérer tous les signalements d'utilisateurs (paginé)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de page (1 par défaut)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page (50 par défaut, max 100)
 *     responses:
 *       200:
 *         description: Liste de signalements
 *       401:
 *         description: Non authentifié
 */
router.get('/users', authMiddleware, (req, res) => reportUserController.getAllReports(req, res));

/**
 * @openapi
 * /reports/users/{reportedUserId}:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Récupérer les signalements concernant un utilisateur spécifique (paginé)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportedUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur signalé
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de page (1 par défaut)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page (50 par défaut, max 100)
 *     responses:
 *       200:
 *         description: Liste de signalements concernant l'utilisateur
 *       401:
 *         description: Non authentifié
 */
router.get('/users/:reportedUserId', authMiddleware, (req, res) => reportUserController.getReportsByReportedUserId(req, res));

export default router;