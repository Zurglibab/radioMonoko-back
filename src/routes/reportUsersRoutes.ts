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

/**
 * @openapi
 * /reports/users/by-reported-user/{reportedUserId}:
 *   delete:
 *     tags:
 *       - Reports
 *     summary: Retirer tous les signalements d'un utilisateur signalé
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportedUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur signalé dont on veut supprimer tous les signalements
 *     responses:
 *       200:
 *         description: Tous les signalements ont été supprimés
 *       400:
 *         description: Paramètre manquant
 *       401:
 *         description: Non authentifié
 */
router.delete('/users/by-reported-user/:reportedUserId', authMiddleware, (req, res) => reportUserController.deleteReportsByReportedUserId(req, res));

/**
 * @openapi
 * /reports/users/{id}:
 *   delete:
 *     tags:
 *       - Reports
 *     summary: Retirer un seul signalement par son ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du signalement à supprimer
 *     responses:
 *       200:
 *         description: Le signalement a été supprimé
 *       400:
 *         description: Paramètre manquant
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Signalement non trouvé
 */
router.delete('/users/:id', authMiddleware, (req, res) => reportUserController.deleteReportById(req, res));

export default router;