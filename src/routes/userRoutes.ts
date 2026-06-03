import { Router } from 'express';
import {UserService} from "../services/userService";
import {UserController} from "../controllers/user.controller";
import {UserBDDRepository} from "../bddRepository/user.bdd.repository";
import { authMiddleware } from '../middlewares/auth.middleware';
import { ownershipOrAdmin } from '../middlewares/ownership.middleware';
import { UserRelationDAO } from '../DAO/userRelationDAO';
import { UserRelationRepository } from '../repository/userRelationRepository';
import { FeedService } from '../services/feedService';
import { ContentStatusDAO } from '../DAO/contentStatusDAO';
import { ContentStatusService } from '../services/contentStatusService';
import { FeedController } from '../controllers/feed.controller';

const userRouter = Router();
const userRepository = new UserBDDRepository();
const userService = new UserService(userRepository);
const contentStatusService = new ContentStatusService(new ContentStatusDAO());
const userController = new UserController(userService, contentStatusService);
const userRelationRepository = new UserRelationRepository(new UserRelationDAO());
const feedController = new FeedController(new FeedService(userRelationRepository));

/**
 * @openapi
 * /user/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Inscription d'un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@test.com
 *               password:
 *                 type: string
 *                 example: password123
 *               username:
 *                 type: string
 *                 example: testuser
 *               privacy:
 *                 type: string
 *                 enum: [public, private]
 *                 example: public
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Données invalides ou utilisateur existant
 */
userRouter.post('/register', userController.createUser);

/**
 * @openapi
 * /user/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Connexion d'un utilisateur existant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@test.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Connexion réussie, renvoie le token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Identifiants invalides
 */
userRouter.post('/login', userController.loginUser);

/**
 * @openapi
 * /user/refresh:
 *   get:
 *     tags:
 *       - Users
 *     summary: Renouveler le token d'accès à l'aide d'un refresh token
 *     description: >
 *       Renvoie un nouveau access token (et optionnellement un nouveau refresh token).
 *       Le refresh token doit être fourni soit dans un cookie httpOnly nommé `refreshToken`
 *       (recommandé), soit en header `Authorization: Bearer <refresh-token>`.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Nouveau token généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       '401':
 *         description: Token absent ou invalide
 *       '403':
 *         description: Refresh token révoqué ou non autorisé
 *       '500':
 *         description: Erreur interne serveur
 */
userRouter.get('/refresh', authMiddleware, userController.refreshToken);

/**
 * @openapi
 * /user/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur (sans le mot de passe)
 *       401:
 *         description: Non autorisé (Token manquant ou invalide)
 *       404:
 *         description: Utilisateur non trouvé
 */
userRouter.get('/me', authMiddleware, userController.getMe);

/**
 * @openapi
 * /user/me/library:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer la bibliothèque complète de l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bibliothèque de l'utilisateur avec le statut associé pour chaque contenu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   content_id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   status:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                   updated_at:
 *                     type: string
 *                   content:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       api_id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       content_type:
 *                         type: string
 *                       created_at:
 *                         type: string
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur interne
 */
userRouter.get('/me/library', authMiddleware, userController.getMyLibrary);

/**
 * @openapi
 * /user/me/feed:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer le fil d'actualité de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 250
 *           example: 50
 *         description: Nombre maximal d'éléments à renvoyer dans le feed
 *     responses:
 *       200:
 *         description: Fil d'actualité récupéré avec succès
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur interne du serveur
 */
userRouter.get('/me/feed', authMiddleware, feedController.getMyFeed);

/**
 * @openapi
 * /user/me:
 *   put:
 *     tags:
 *       - Users
 *     summary: Mettre à jour les informations de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               display_name:
 *                 type: string
 *               avatar:
 *                 type: string
 *               bio:
 *                 type: string
 *               website:
 *                 type: string
 *               privacy:
 *                 type: string
 *                 enum: [public, private]
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Modification du mot de passe non autorisée via cette route
 *       404:
 *         description: Utilisateur non trouvé
 */
userRouter.put('/me', authMiddleware, userController.updateMe);

/**
 * @openapi
 * /user/search:
 *   get:
 *     tags:
 *       - Users
 *     summary: Recherche parmi les utilisateurs publics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Mot-clé pour rechercher (nom d'utilisateur ou pseudo)
 *     responses:
 *       200:
 *         description: Liste des utilisateurs publics trouvés
 *       400:
 *         description: Paramètre de recherche manquant
 *       401:
 *         description: Non autorisé
 */
userRouter.get('/search', authMiddleware, userController.searchPublicUsers);

/**
 * @openapi
 * /user/id/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupère un utilisateur par son ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur non trouvé
 */
userRouter.get('/id/:id', authMiddleware, userController.getUserById);

/**
 * @openapi
 * /user/delete/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Supprime un utilisateur par son ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 */
userRouter.delete('/delete/:id', authMiddleware, ownershipOrAdmin('id'), userController.deleteUserById);

export default userRouter;