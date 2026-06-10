import { Router } from 'express';
import { ownershipOrAdmin, ownershipOrAdminBody } from '../middlewares/ownership.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { LikeReviewDAO } from '../DAO/likeReviewDAO';
import { LikeReviewService } from '../services/likeReviewService';
import { LikeReviewController } from '../controllers/likeReview.controller';
// (ownershipOrAdmin already imported as named export)

export const createLikeReviewRouter = () => {
  const router = Router();
  const repository = new LikeReviewDAO();
  const service = new LikeReviewService(repository);
  const controller = new LikeReviewController(service);

  /**
   * @openapi
   * components:
   *   schemas:
   *     LikeReview:
   *       type: object
   *       required:
   *         - review_id
   *         - user_id
   *         - is_like
   *       properties:
   *         review_id:
   *           type: string
   *           format: uuid
   *         user_id:
   *           type: string
   *           format: uuid
   *         is_like:
   *           type: boolean
   *         created_at:
   *           type: string
   *           format: date-time
   *     UpsertLikeReviewDTO:
   *       type: object
   *       required:
   *         - user_id
   *         - is_like
   *       properties:
   *         user_id:
   *           type: string
   *           format: uuid
   *         is_like:
   *           type: boolean
   *     DeleteLikeReviewDTO:
   *       type: object
   *       required:
   *         - user_id
   *       properties:
   *         user_id:
   *           type: string
   *           format: uuid
   *     LikeReviewCount:
   *       type: object
   *       properties:
   *         likes:
   *           type: integer
   *         dislikes:
   *           type: integer
   *         total:
   *           type: integer
   */

  /**
   * @openapi
   * /review/{reviewId}/likes:
   *   post:
   *     tags: [LikeReview]
   *     summary: Ajouter ou mettre a jour un like/dislike sur une review
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: reviewId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpsertLikeReviewDTO'
   *     responses:
   *       201:
   *         description: LikeReview cree ou mis a jour
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LikeReview'
   */
  router.post('/:reviewId/likes', authMiddleware, ownershipOrAdminBody('user_id'), controller.upsert);

  /**
   * @openapi
   * /review/{reviewId}/likes:
   *   delete:
   *     tags: [LikeReview]
   *     summary: Supprimer mon like/dislike d'une review
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: reviewId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/DeleteLikeReviewDTO'
   *     responses:
   *       200:
   *         description: LikeReview supprime
   *       404:
   *         description: LikeReview non trouve
   */
  // Support both forms for backward compatibility with tests/clients:
  // - DELETE /review/:reviewId/likes with { user_id } in body
  // - DELETE /review/:reviewId/likes/:userId with userId as path param (protected by ownership)
  router.delete('/:reviewId/likes', authMiddleware, ownershipOrAdminBody('user_id'), controller.deleteByReviewIdAndUserId);
  router.delete('/:reviewId/likes/:userId', authMiddleware, ownershipOrAdmin('userId'), controller.deleteByReviewIdAndUserId);

  /**
   * @openapi
   * /review/{reviewId}/likes:
   *   get:
   *     tags: [LikeReview]
   *     summary: Recuperer les likes/dislikes d'une review
   *     parameters:
   *       - in: path
   *         name: reviewId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Liste des likes/dislikes
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/LikeReview'
   */
  router.get('/:reviewId/likes', controller.getByReviewId);

  /**
   * @openapi
   * /review/{reviewId}/likes/count:
   *   get:
   *     tags: [LikeReview]
   *     summary: Recuperer le compteur likes/dislikes d'une review
   *     parameters:
   *       - in: path
   *         name: reviewId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Compteur des likes/dislikes
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LikeReviewCount'
   */
  router.get('/:reviewId/likes/count', controller.getCountByReviewId);

  return router;
};
