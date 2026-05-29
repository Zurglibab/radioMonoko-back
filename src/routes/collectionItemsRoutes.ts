import { Router } from 'express';
import { ownershipOrAdminResource, ownershipOrAdminBody } from '../middlewares/ownership.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { CollectionItemsDTO } from '../DAO/collectionItemsDTO';
import { CollectionItemsService } from '../services/collectionItemsService';
import { CollectionItemsController } from '../controllers/collectionItems.controller';

export const createCollectionItemsRouter = () => {
  const router = Router();
  const repository = new CollectionItemsDTO();
  const service = new CollectionItemsService(repository);
  const controller = new CollectionItemsController(service);

  /**
   * @openapi
   * components:
   *   schemas:
   *     CollectionItem:
   *       type: object
   *       required:
   *         - collection_id
   *         - content_id
   *       properties:
   *         collection_id:
   *           type: string
   *           format: uuid
   *         content_id:
   *           type: string
   *           format: uuid
   *         position:
   *           type: integer
   *         note:
   *           type: string
   *           nullable: true
   *         created_at:
   *           type: string
   *           format: date-time
   *     CreateCollectionItemDTO:
   *       type: object
   *       required:
   *         - collection_id
   *         - content_id
   *       properties:
   *         collection_id:
   *           type: string
   *           format: uuid
   *         content_id:
   *           type: string
   *           format: uuid
   *         position:
   *           type: integer
   *         note:
   *           type: string
   *     UpdateCollectionItemDTO:
   *       type: object
   *       properties:
   *         position:
   *           type: integer
   *         note:
   *           type: string
   */

  /**
   * @openapi
   * /collectionItems:
   *   get:
   *     tags: [CollectionItems]
   *     summary: Recuperer tous les elements de collections
   *     responses:
   *       200:
   *         description: Liste des elements
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/CollectionItem'
   */
  router.get('/', controller.getAll);

  /**
   * @openapi
   * /collectionItems/collection/{collectionId}:
   *   get:
   *     tags: [CollectionItems]
   *     summary: Recuperer les elements d'une collection
   *     parameters:
   *       - in: path
   *         name: collectionId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Liste des elements de la collection
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/CollectionItem'
   */
  router.get('/collection/:collectionId', controller.getByCollectionId);

  /**
   * @openapi
   * /collectionItems/collection/{collectionId}/content/{contentId}:
   *   get:
   *     tags: [CollectionItems]
   *     summary: Recuperer un element par cle composee
   *     parameters:
   *       - in: path
   *         name: collectionId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: path
   *         name: contentId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Element trouve
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CollectionItem'
   *       404:
   *         description: Element non trouve
   */
  router.get('/collection/:collectionId/content/:contentId', controller.getByKeys);

  /**
   * @openapi
   * /collectionItems:
   *   post:
   *     tags: [CollectionItems]
   *     summary: Ajouter un element a une collection
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCollectionItemDTO'
   *     responses:
   *       201:
   *         description: Element cree
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CollectionItem'
   *       400:
   *         description: Requete invalide
   */
  // Ensure the collection being modified belongs to the authenticated user
  router.post('/', authMiddleware, ownershipOrAdminBody('collection_id'), controller.create);

  /**
   * @openapi
   * /collectionItems/collection/{collectionId}/content/{contentId}:
   *   put:
   *     tags: [CollectionItems]
   *     summary: Mettre a jour un element de collection
   *     parameters:
   *       - in: path
   *         name: collectionId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: path
   *         name: contentId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateCollectionItemDTO'
   *     responses:
   *       200:
   *         description: Element mis a jour
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CollectionItem'
   *       404:
   *         description: Element non trouve
   */
  router.put('/collection/:collectionId/content/:contentId', authMiddleware, ownershipOrAdminResource('collections', 'collectionId', 'user_id'), controller.updateByKeys);

  /**
   * @openapi
   * /collectionItems/collection/{collectionId}/content/{contentId}:
   *   delete:
   *     tags: [CollectionItems]
   *     summary: Supprimer un element de collection
   *     parameters:
   *       - in: path
   *         name: collectionId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: path
   *         name: contentId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Element supprime
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CollectionItem'
   *       404:
   *         description: Element non trouve
   */
  router.delete('/collection/:collectionId/content/:contentId', authMiddleware, ownershipOrAdminResource('collections', 'collectionId', 'user_id'), controller.deleteByKeys);

  return router;
};

export default createCollectionItemsRouter;