import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { UserRelationController } from '../controllers/userRelation.controller';
import { UserRelationService } from '../services/userRelationService';
import { UserRelationRepository } from '../repository/userRelationRepository';
import { UserRelationDAO } from '../DAO/userRelationDAO';
import { UserBDDRepository } from '../bddRepository/user.bdd.repository';

const userRelationRouter = Router();

const userRepository = new UserBDDRepository();

const userRelationDAO = new UserRelationDAO();
const userRelationRepository = new UserRelationRepository(userRelationDAO);
const userRelationService = new UserRelationService(userRelationRepository, userRepository);
const userRelationController = new UserRelationController(userRelationService);

/**
 * @openapi
 * /userRelation/friends:
 *   get:
 *     tags:
 *       - UserRelations
 *     summary: Récupère la liste d'amis de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste d'amis récupérée avec succès
 *       401:
 *         description: Non authentifié
 */
userRelationRouter.get('/friends', authMiddleware, userRelationController.getFriends);

/**
 * @openapi
 * /userRelation/friends/{id}:
 *   get:
 *     tags:
 *       - UserRelations
 *     summary: Récupère la liste d'amis d'un utilisateur spécifique par son ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur à consulter
 *     responses:
 *       200:
 *         description: Liste d'amis récupérée avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Profil privé ou bloqué
 *       404:
 *         description: Utilisateur non trouvé
 */
userRelationRouter.get('/friends/:id', authMiddleware, userRelationController.getFriendsForOther);

/**
 * @openapi
 * /userRelation/request:
 *   get:
 *     tags:
 *       - UserRelations
 *     summary: Récupère les demandes d'ami en attente de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Demandes d'amis en attente récupérées avec succès
 *       401:
 *         description: Non authentifié
 */
userRelationRouter.get('/request', authMiddleware,  userRelationController.getPendingRequests);

/**
 * @openapi
 * /userRelation/follow/{id}:
 *   post:
 *     tags:
 *       - UserRelations
 *     summary: S'abonner ou envoyer une demande d'ami à un utilisateur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur cible
 *     responses:
 *       201:
 *         description: Opération réussie (suivis ou demande envoyée)
 *       400:
 *         description: Impossible de suivre cet utilisateur (déjà suivi, etc.)
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur non trouvé
 */
userRelationRouter.post('/follow/:id', authMiddleware, userRelationController.follow);

/**
 * @openapi
 * /userRelation/unfollow/{id}:
 *   delete:
 *     tags:
 *       - UserRelations
 *     summary: Se désabonner d'un utilisateur ou retirer un ami
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur cible
 *     responses:
 *       200:
 *         description: Utilisateur retiré des amis / désabonnement réussi
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur non trouvé ou non suivi
 */
userRelationRouter.delete('/unfollow/:id', authMiddleware, userRelationController.unfollow);

/**
 * @openapi
 * /userRelation/accept/{id}:
 *   patch:
 *     tags:
 *       - UserRelations
 *     summary: Accepter une demande d'ami
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur ayant envoyé la demande
 *     responses:
 *       200:
 *         description: Demande d'ami acceptée
 *       400:
 *         description: Aucune demande en attente
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur non trouvé
 */
userRelationRouter.patch('/accept/:id', authMiddleware, userRelationController.accept);

/**
 * @openapi
 * /userRelation/refuse/{id}:
 *   patch:
 *     tags:
 *       - UserRelations
 *     summary: Refuser une demande d'ami
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur ayant envoyé la demande
 *     responses:
 *       200:
 *         description: Demande d'ami refusée
 *       400:
 *         description: Aucune demande en attente
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur non trouvé
 */
userRelationRouter.patch('/refuse/:id', authMiddleware, userRelationController.refuse);

/**
 * @openapi
 * /userRelation/block/{id}:
 *   post:
 *     tags:
 *       - UserRelations
 *     summary: Bloquer un utilisateur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur à bloquer
 *     responses:
 *       200:
 *         description: Utilisateur bloqué avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur non trouvé
 */
userRelationRouter.post('/block/:id', authMiddleware, userRelationController.block);

export default userRelationRouter;
