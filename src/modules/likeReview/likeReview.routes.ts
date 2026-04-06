import { Router } from 'express';
import { LikeReviewBDDRepository } from './likeReview.bdd.repository';
import { LikeReviewService } from './likeReview.service';
import { LikeReviewController } from './likeReview.controller';

export const createLikeReviewRouter = () => {
    const router = Router();
    const repository = new LikeReviewBDDRepository();
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
    router.post('/:reviewId/likes', controller.upsert);

    /**
     * @openapi
     * /review/{reviewId}/likes:
     *   delete:
     *     tags: [LikeReview]
     *     summary: Supprimer mon like/dislike d'une review
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
    router.delete('/:reviewId/likes', controller.deleteByReviewIdAndUserId);

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

export default createLikeReviewRouter;

