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
 * /userRelation/followers:
 *   get:
 *     tags:
 *       - UserRelations
 *     summary: Récupère la liste des followers de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de followers récupérée avec succès
 *       401:
 *         description: Non authentifié
 */
userRelationRouter.get('/followers', authMiddleware, userRelationController.getFollowers);

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

/**
 * @openapi
 * /userRelation/following:
 *   get:
 *     tags:
 *       - UserRelations
 *     summary: Récupère la liste des utilisateurs que l'utilisateur connecté suit (acceptés ou en attente)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs suivis récupérée avec succès
 *       401:
 *         description: Non authentifié
 */
userRelationRouter.get('/following', authMiddleware, userRelationController.getFollowing);

/**
 * @openapi
 * /userRelation/is-friend/{id}:
 *   get:
 *     tags:
 *       - UserRelations
 *     summary: Vérifie si deux utilisateurs sont amis (si l'un suit l'autre et que c'est accepté)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur à vérifier
 *     responses:
 *       200:
 *         description: Booléen indiquant si les utilisateurs sont amis
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur non trouvé
 */
userRelationRouter.get('/is-friend/:id', authMiddleware, userRelationController.checkIsFriend);

/**
 * @openapi
 * /userRelation/blocked:
 *   get:
 *     tags:
 *       - UserRelations
 *     summary: Récupère la liste des utilisateurs que l'utilisateur connecté a bloqués
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs bloqués récupérée avec succès
 *       401:
 *         description: Non authentifié
 */
userRelationRouter.get('/blocked', authMiddleware, userRelationController.getBlockedUsers);

/**
 * @openapi
 * /userRelation/relation/as-follower/{id}:
 *   get:
 *     tags:
 *       - UserRelations
 *     summary: Récupère ma relation (en tant que follower) envers l'utilisateur ciblé
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
 *         description: Relation récupérée
 *       401:
 *         description: Non authentifié
 */
userRelationRouter.get('/relation/as-follower/:id', authMiddleware, userRelationController.getRelationAsFollower);

/**
 * @openapi
 * /userRelation/relation/as-followed/{id}:
 *   get:
 *     tags:
 *       - UserRelations
 *     summary: Récupère la relation d'un autre envers moi (en tant que followed)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur qui est potentiellement follower
 *     responses:
 *       200:
 *         description: Relation récupérée
 *       401:
 *         description: Non authentifié
 */
userRelationRouter.get('/relation/as-followed/:id', authMiddleware, userRelationController.getRelationAsFollowed);

export default userRelationRouter;