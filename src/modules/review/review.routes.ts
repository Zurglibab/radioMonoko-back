import { Router } from 'express';
import { ReviewBDDRepository } from './review.bdd.repository';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';

export const createReviewRouter = () => {
    const router = Router();
    const repository = new ReviewBDDRepository();
    const service = new ReviewService(repository);
    const controller = new ReviewController(service);

    /**
     * @openapi
     * components:
     *   schemas:
     *     Review:
     *       type: object
     *       required:
     *         - id
     *         - user_id
     *         - content_id
     *       properties:
     *         id:
     *           type: string
     *           format: uuid
     *         user_id:
     *           type: string
     *           format: uuid
     *         content_id:
     *           type: string
     *           format: uuid
     *         parent_review_id:
     *           type: string
     *           format: uuid
     *           nullable: true
     *         comment:
     *           type: string
     *           nullable: true
     *         created_at:
     *           type: string
     *           format: date-time
     *     CreateReviewDTO:
     *       type: object
     *       required:
     *         - user_id
     *         - content_id
     *       properties:
     *         user_id:
     *           type: string
     *           format: uuid
     *         content_id:
     *           type: string
     *           format: uuid
     *         parent_review_id:
     *           type: string
     *           format: uuid
     *           nullable: true
     *         comment:
     *           type: string
     *     UpdateReviewDTO:
     *       type: object
     *       properties:
     *         parent_review_id:
     *           type: string
     *           format: uuid
     *           nullable: true
     *         comment:
     *           type: string
     */

    /**
     * @openapi
     * /review:
     *   get:
     *     tags: [Review]
     *     summary: Recuperer toutes les reviews
     *     responses:
     *       200:
     *         description: Liste des reviews
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Review'
     */
    router.get('/', controller.getAll);

    /**
     * @openapi
     * /review/{id}:
     *   get:
     *     tags: [Review]
     *     summary: Recuperer une review par id
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Review trouvee
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Review'
     *       404:
     *         description: Review non trouvee
     */
    router.get('/:id', controller.getById);

    /**
     * @openapi
     * /review/content/{contentId}:
     *   get:
     *     tags: [Review]
     *     summary: Recuperer les reviews d'un contenu
     *     parameters:
     *       - in: path
     *         name: contentId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Liste des reviews du contenu
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Review'
     */
    router.get('/content/:contentId', controller.getByContentId);

    /**
     * @openapi
     * /review/parent/{parentReviewId}:
     *   get:
     *     tags: [Review]
     *     summary: Recuperer les reviews associees a un parent_review_id
     *     parameters:
     *       - in: path
     *         name: parentReviewId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *           nullable: true
     *     responses:
     *       200:
     *         description: Liste des reviews associees au parent
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Review'
     */
    router.get('/parent/:parentReviewId', controller.getByParentReviewId);

    /**
     * @openapi
     * /review:
     *   post:
     *     tags: [Review]
     *     summary: Creer une review
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateReviewDTO'
     *     responses:
     *       201:
     *         description: Review creee
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Review'
     *       400:
     *         description: Requete invalide
     */
    router.post('/', controller.create);

    /**
     * @openapi
     * /review/{id}:
     *   put:
     *     tags: [Review]
     *     summary: Mettre a jour une review
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateReviewDTO'
     *     responses:
     *       200:
     *         description: Review mise a jour
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Review'
     *       404:
     *         description: Review non trouvee
     */
    router.put('/:id', controller.updateById);

    /**
     * @openapi
     * /review/{id}:
     *   delete:
     *     tags: [Review]
     *     summary: Supprimer une review
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Review supprimee
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Review'
     *       404:
     *         description: Review non trouvee
     */
    router.delete('/:id', controller.deleteById);

    return router;
};
