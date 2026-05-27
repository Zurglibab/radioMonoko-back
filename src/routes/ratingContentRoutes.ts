import { Router } from 'express';
import { RatingContentDAO } from '../DAO/ratingContentDAO';
import { RatingContentService } from '../services/ratingContentService';
import { RatingContentController } from '../controllers/ratingContent.controller';

export const createRatingContentRouter = () => {
  const router = Router();
  const repository = new RatingContentDAO();
  const service = new RatingContentService(repository);
  const controller = new RatingContentController(service);

  /**
   * @openapi
   * components:
   *   schemas:
   *     RatingContent:
   *       type: object
   *       required:
   *         - content_id
   *         - user_id
   *         - average_rating
   *       properties:
   *         content_id:
   *           type: string
   *           format: uuid
   *         user_id:
   *           type: string
   *           format: uuid
   *         average_rating:
   *           type: number
   *           format: float
   *           minimum: 0
   *           maximum: 5
   *     CreateRatingContentDTO:
   *       type: object
   *       required:
   *         - content_id
   *         - user_id
   *         - average_rating
   *       properties:
   *         content_id:
   *           type: string
   *           format: uuid
   *         user_id:
   *           type: string
   *           format: uuid
   *         average_rating:
   *           type: number
   *           format: float
   *           minimum: 0
   *           maximum: 5
   *     UpdateRatingContentDTO:
   *       type: object
   *       required:
   *         - average_rating
   *       properties:
   *         average_rating:
   *           type: number
   *           format: float
   *           minimum: 0
   *           maximum: 5
   */

  /**
   * @openapi
   * /ratingContent:
   *   get:
   *     tags: [RatingContent]
   *     summary: Recuperer toutes les notations de contenu
   *     responses:
   *       200:
   *         description: Liste des notations
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/RatingContent'
   */
  router.get('/', controller.getAll);

  /**
   * @openapi
   * /ratingContent/content/{contentId}/user/{userId}:
   *   get:
   *     tags: [RatingContent]
   *     summary: Recuperer une notation par content_id et user_id
   *     parameters:
   *       - in: path
   *         name: contentId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Notation trouvee
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RatingContent'
   *       404:
   *         description: Notation non trouvee
   */
  router.get('/content/:contentId/user/:userId', controller.getByKeys);

  /**
   * @openapi
   * /ratingContent:
   *   post:
   *     tags: [RatingContent]
   *     summary: Creer une notation pour un contenu
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateRatingContentDTO'
   *     responses:
   *       201:
   *         description: Notation creee
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RatingContent'
   *       400:
   *         description: Requete invalide
   */
  router.post('/', controller.create);

  /**
   * @openapi
   * /ratingContent/content/{contentId}/user/{userId}:
   *   put:
   *     tags: [RatingContent]
   *     summary: Mettre a jour une notation
   *     parameters:
   *       - in: path
   *         name: contentId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateRatingContentDTO'
   *     responses:
   *       200:
   *         description: Notation mise a jour
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RatingContent'
   *       400:
   *         description: Requete invalide
   *       404:
   *         description: Notation non trouvee
   */
  router.put('/content/:contentId/user/:userId', controller.updateByKeys);

  /**
   * @openapi
   * /ratingContent/content/{contentId}/user/{userId}:
   *   delete:
   *     tags: [RatingContent]
   *     summary: Supprimer une notation
   *     parameters:
   *       - in: path
   *         name: contentId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Notation supprimee
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RatingContent'
   *       404:
   *         description: Notation non trouvee
   */
  router.delete('/content/:contentId/user/:userId', controller.deleteByKeys);

  return router;
};

export default createRatingContentRouter;