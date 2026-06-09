import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { reportReviewController } from '../controllers/reportReview.controller';

const router = Router();

/**
 * @openapi
 * /reports/reviews:
 *   post:
 *     tags:
 *       - Reports
 *     summary: Signaler une review
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               review_id:
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
router.post('/reviews', authMiddleware, (req, res) => reportReviewController.createReport(req, res));

/**
 * @openapi
 * /reports/reviews:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Récupérer tous les signalements de reviews (paginé)
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
router.get('/reviews', authMiddleware, (req, res) => reportReviewController.getAllReports(req, res));

/**
 * @openapi
 * /reports/reviews/{reviewId}:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Récupérer les signalements concernant une review spécifique (paginé)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la review signalée
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
 *         description: Liste de signalements concernant la review
 *       401:
 *         description: Non authentifié
 */
router.get('/reviews/:reviewId', authMiddleware, (req, res) => reportReviewController.getReportsByReviewId(req, res));

/**
 * @openapi
 * /reports/reviews/by-review/{reviewId}:
 *   delete:
 *     tags:
 *       - Reports
 *     summary: Retirer tous les signalements d'une review signalée
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la review dont on veut supprimer tous les signalements
 *     responses:
 *       200:
 *         description: Tous les signalements ont été supprimés
 *       400:
 *         description: Paramètre manquant
 *       401:
 *         description: Non authentifié
 */
router.delete('/reviews/by-review/:reviewId', authMiddleware, (req, res) => reportReviewController.deleteReportsByReviewId(req, res));

/**
 * @openapi
 * /reports/reviews/{id}:
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
router.delete('/reviews/:id', authMiddleware, (req, res) => reportReviewController.deleteReportById(req, res));

export default router;
