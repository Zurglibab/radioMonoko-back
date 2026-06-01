import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { ownershipOrAdminBody } from '../middlewares/ownership.middleware';
import { ContentStatusDAO } from '../DAO/contentStatusDAO';
import { ContentStatusService } from '../services/contentStatusService';
import { ContentStatusController } from '../controllers/contentStatus.controller';

export const createContentStatusRouter = () => {
  const router = Router();
  const repository = new ContentStatusDAO();
  const service = new ContentStatusService(repository);
  const controller = new ContentStatusController(service);

  /**
   * @openapi
   * components:
   *   schemas:
   *     ContentStatusRecord:
   *       type: object
   *       required:
   *         - content_id
   *         - user_id
   *         - status
   *       properties:
   *         content_id:
   *           type: string
   *           format: uuid
   *         user_id:
   *           type: string
   *           format: uuid
   *         status:
   *           type: string
   *           enum: ['à voir', 'commencer', 'fini']
   *         created_at:
   *           type: string
   *           format: date-time
   *         updated_at:
   *           type: string
   *           format: date-time
   */

  /**
   * @openapi
   * /content/status/list:
   *   get:
   *     tags: [Content]
   *     summary: Recuperer la liste des statuts disponibles pour un contenu
   *     responses:
   *       200:
   *         description: Liste des statuts disponibles
   */
  router.get('/list', controller.getAllStatuses);

  /**
   * @openapi
   * /content/status/{contentId}/user/{userId}:
   *   get:
   *     tags: [Content]
   *     summary: Recuperer le statut d'un contenu pour un utilisateur
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
   *         description: Statut trouve
   */
  router.get('/:contentId/user/:userId', authMiddleware, controller.getByKeys);

  /**
   * @openapi
   * /content/status:
   *   put:
   *     tags: [Content]
   *     summary: Ajouter ou modifier le statut d'un contenu pour un utilisateur
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ContentStatusRecord'
   *     responses:
   *       200:
   *         description: Statut enregistre
   */
  router.put('/', authMiddleware, ownershipOrAdminBody('user_id'), controller.upsert);

  return router;
};

export default createContentStatusRouter;

