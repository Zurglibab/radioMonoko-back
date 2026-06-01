import { Router } from 'express';
import { ContentDAO } from '../DAO/contentDAO';
import { ContentService } from '../services/contentService';
import { ContentController } from '../controllers/content.controller';
import { createContentStatusRouter } from './contentStatusRoutes';

export const createContentRouter = () => {
  const contentRouter = Router();
  const contentRepository = new ContentDAO();
  const contentService = new ContentService(contentRepository);
  const contentController = new ContentController(contentService);

  /**
   * @openapi
   * components:
   *   schemas:
   *     Content:
   *       type: object
   *       required:
   *         - id
   *         - api_id
   *         - title
   *         - content_type
   *       properties:
   *         id:
   *           type: string
   *           format: uuid
   *         api_id:
   *           type: string
   *         title:
   *           type: string
   *         description:
   *           type: string
   *           nullable: true
   *         content_type:
   *           type: string
   *           enum: [show, diffusion, live, podcast, article, other]
   *         created_at:
   *           type: string
   *           format: date-time
   *     CreateContentDTO:
   *       type: object
   *       required:
   *         - api_id
   *         - title
   *         - content_type
   *       properties:
   *         api_id:
   *           type: string
   *         title:
   *           type: string
   *         description:
   *           type: string
   *         content_type:
   *           type: string
   *           enum: [show, diffusion, live, podcast, article, other]
   *     UpdateContentDTO:
   *       type: object
   *       properties:
   *         title:
   *           type: string
   *         description:
   *           type: string
   *         content_type:
   *           type: string
   *           enum: [show, diffusion, live, podcast, article, other]
   */

  /**
   * @openapi
   * /content:
   *   get:
   *     tags: [Content]
   *     summary: Recuperer tous les contenus
   *     responses:
   *       200:
   *         description: Liste des contenus
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Content'
   */
  contentRouter.get('/', contentController.getAll);

  contentRouter.use('/status', createContentStatusRouter());

  /**
   * @openapi
   * /content/{id}:
   *   get:
   *     tags: [Content]
   *     summary: Recuperer un contenu par id
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Contenu trouve
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Content'
   *       404:
   *         description: Contenu non trouve
   */
  contentRouter.get('/:id', contentController.getById);

  /**
   * @openapi
   * /content:
   *   post:
   *     tags: [Content]
   *     summary: Creer un contenu
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateContentDTO'
   *     responses:
   *       201:
   *         description: Contenu cree
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Content'
   *       400:
   *         description: Requete invalide
   */
  contentRouter.post('/', contentController.create);

  /**
   * @openapi
   * /content/{id}:
   *   put:
   *     tags: [Content]
   *     summary: Mettre a jour un contenu
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
   *             $ref: '#/components/schemas/UpdateContentDTO'
   *     responses:
   *       200:
   *         description: Contenu mis a jour
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Content'
   *       404:
   *         description: Contenu non trouve
   */
  contentRouter.put('/:id', contentController.updateById);

  /**
   * @openapi
   * /content/{id}:
   *   delete:
   *     tags: [Content]
   *     summary: Supprimer un contenu
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Contenu supprime
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Content'
   *       404:
   *         description: Contenu non trouve
   */
  contentRouter.delete('/:id', contentController.deleteById);


  return contentRouter;
};

export default createContentRouter;