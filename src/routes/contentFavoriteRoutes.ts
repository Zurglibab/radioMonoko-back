import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { ownershipOrAdmin, ownershipOrAdminBody } from '../middlewares/ownership.middleware';
import { ContentFavoriteDAO } from '../DAO/contentFavoriteDAO';
import { ContentFavoriteService } from '../services/contentFavoriteService';
import { ContentFavoriteController } from '../controllers/contentFavorite.controller';

export const createContentFavoriteRouter = () => {
  const router = Router();
  const repository = new ContentFavoriteDAO();
  const service = new ContentFavoriteService(repository);
  const controller = new ContentFavoriteController(service);

  /**
   * @openapi
   * components:
   *   schemas:
   *     ContentFavorite:
   *       type: object
   *       required:
   *         - content_id
   *         - user_id
   *       properties:
   *         content_id:
   *           type: string
   *           format: uuid
   *         user_id:
   *           type: string
   *           format: uuid
   *         created_at:
   *           type: string
   *           format: date-time
   */

  /**
   * @openapi
   * /content/favorites/user/{userId}:
   *   get:
   *     tags: [Content]
   *     summary: Recuperer les favoris d'un utilisateur
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   */
  router.get('/favorites/user/:userId', authMiddleware, controller.getByUserId);

  /**
   * @openapi
   * /content/favorites/{contentId}/user/{userId}:
   *   get:
   *     tags: [Content]
   *     summary: Recuperer un favori contenu/utilisateur
   */
  router.get('/favorites/:contentId/user/:userId', authMiddleware, controller.getByKeys);

  /**
   * @openapi
   * /content/favorites:
   *   post:
   *     tags: [Content]
   *     summary: Ajouter un contenu aux favoris d'un utilisateur
   */
  router.post('/favorites', authMiddleware, ownershipOrAdminBody('user_id'), controller.create);

  /**
   * @openapi
   * /content/favorites/{contentId}/user/{userId}:
   *   delete:
   *     tags: [Content]
   *     summary: Retirer un contenu des favoris d'un utilisateur
   */
  router.delete('/favorites/:contentId/user/:userId', authMiddleware, ownershipOrAdmin('userId'), controller.deleteByKeys);

  return router;
};


