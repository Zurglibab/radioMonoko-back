import { Router } from 'express';
import {UserService} from "../services/user.services";
import {UserController} from "../controllers/user.controller";
import {UserBDDRepository} from "../bddRepository/user.bdd.repository";
import { authMiddleware } from '../middlewares/auth.middleware';

const userRouter = Router();
const userRepository = new UserBDDRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

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
 * /user/{email}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupère un utilisateur par son email
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: L'email de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur non trouvé
 */
userRouter.get('/:email', authMiddleware, userController.getUserByEmail);

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
userRouter.delete('/delete/:id', authMiddleware, userController.deleteUserById);

export default userRouter;