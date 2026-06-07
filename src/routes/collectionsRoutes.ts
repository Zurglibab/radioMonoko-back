import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { ownershipOrAdminBody, ownershipOrAdminResource } from '../middlewares/ownership.middleware';
import { CollectionDAO } from '../DAO/collectionDAO';
import { CollectionsService } from '../services/collectionsService';
import { CollectionsController } from '../controllers/collections.controller';

export const createCollectionsRouter = () => {
  const router = Router();

  const repository = new CollectionDAO();
  const service = new CollectionsService(repository);
  const controller = new CollectionsController(service);

  /**
   * @openapi
   * components:
   *   schemas:
   *     Collection:
   *       type: object
   *       required:
   *         - id
   *         - user_id
   *         - name
   *         - status
   *       properties:
   *         id:
   *           type: string
   *           format: uuid
   *         user_id:
   *           type: string
   *           format: uuid
   *         name:
   *           type: string
   *         description:
   *           type: string
   *           nullable: true
   *         is_public:
   *           type: boolean
   *         status:
   *           type: string
   *           description: Statut libre saisi comme texte
   *         created_at:
   *           type: string
   *           format: date-time
   *     CreateCollectionDTO:
   *       type: object
   *       required:
   *         - user_id
   *         - name
   *       properties:
   *         user_id:
   *           type: string
   *           format: uuid
   *         name:
   *           type: string
   *         description:
   *           type: string
   *         is_public:
   *           type: boolean
   *         status:
   *           type: string
   *           description: Statut libre saisi comme texte
   *     UpdateCollectionDTO:
   *       type: object
   *       properties:
   *         name:
   *           type: string
   *         description:
   *           type: string
   *         is_public:
   *           type: boolean
   *         status:
   *           type: string
   *           description: Statut libre saisi comme texte
   */

  /**
   * @openapi
   * /collections:
   *   get:
   *     tags: [Collections]
   *     summary: Recuperer toutes les collections
   *     responses:
   *       200:
   *         description: Liste des collections
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Collection'
   */
  router.get('/', controller.getAll);

  /**
   * @openapi
   * /collections/{id}:
   *   get:
   *     tags: [Collections]
   *     summary: Recuperer une collection par id
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Collection trouvee
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Collection'
   *       404:
   *         description: Collection non trouvee
   */
  router.get('/:id', controller.getById);

  /**
   * @openapi
   * /collections:
   *   post:
   *     tags: [Collections]
   *     summary: Creer une collection
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCollectionDTO'
   *     responses:
   *       201:
   *         description: Collection creee
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Collection'
   *       400:
   *         description: Requete invalide
   */
  router.post('/', authMiddleware, ownershipOrAdminBody('user_id'), controller.create);

  /**
   * @openapi
   * /collections/{id}:
   *   put:
   *     tags: [Collections]
   *     summary: Mettre a jour une collection
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
   *             $ref: '#/components/schemas/UpdateCollectionDTO'
   *     responses:
   *       200:
   *         description: Collection mise a jour
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Collection'
   *       404:
   *         description: Collection non trouvee
   */
  router.put('/:id', authMiddleware, ownershipOrAdminResource('collections', 'id', 'user_id'), controller.updateById);

  /**
   * @openapi
   * /collections/{id}:
   *   delete:
   *     tags: [Collections]
   *     summary: Supprimer une collection
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Collection supprimee
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Collection'
   *       404:
   *         description: Collection non trouvee
   */
  router.delete('/:id', authMiddleware, ownershipOrAdminResource('collections', 'id', 'user_id'), controller.deleteById);

  /**
   * @openapi
   * /collections/collection/user/{userId}:
   *   get:
   *     tags: [Collections]
   *     summary: Recuperer les collections d'un utilisateur
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Liste des collections de l'utilisateur
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Collection'
   */
  router.get('/collection/user/:userId', controller.findByUserId);

  return router;
};
