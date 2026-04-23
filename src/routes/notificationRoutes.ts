import { Router } from 'express';
import { NotificationDAO } from '../DAO/notificationDAO';
import { NotificationService } from '../services/notificationService';
import { NotificationController } from '../controllers/notification.controller';

export const createNotificationRouter = () => {
    const router = Router();
    const repository = new NotificationDAO();
    const service = new NotificationService(repository);
    const controller = new NotificationController(service);

    /**
     * @openapi
     * components:
     *   schemas:
     *     Notification:
     *       type: object
     *       required:
     *         - id
     *         - user_id
     *         - type
     *         - message
     *       properties:
     *         id:
     *           type: string
     *           format: uuid
     *         user_id:
     *           type: string
     *           format: uuid
     *         type:
     *           type: string
     *         message:
     *           type: string
     *         is_read:
     *           type: boolean
     *         created_at:
     *           type: string
     *           format: date-time
     *         updated_at:
     *           type: string
     *           format: date-time
     *     CreateNotificationDTO:
     *       type: object
     *       required:
     *         - user_id
     *         - type
     *         - message
     *       properties:
     *         user_id:
     *           type: string
     *           format: uuid
     *         type:
     *           type: string
     *         message:
     *           type: string
     *         is_read:
     *           type: boolean
     *     UpdateNotificationDTO:
     *       type: object
     *       properties:
     *         type:
     *           type: string
     *         message:
     *           type: string
     *         is_read:
     *           type: boolean
     */

    /**
     * @openapi
     * /api/notifications:
     *   get:
     *     tags: [Notifications]
     *     summary: Recuperer toutes les notifications
     *     responses:
     *       200:
     *         description: Liste des notifications
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Notification'
     *       500:
     *         description: Erreur serveur
     */

    router.get('/', controller.getAll);

    /**
     * @openapi
     * /api/notifications/user/{userId}:
     *   get:
     *     tags: [Notifications]
     *     summary: Recuperer les notifications d'un utilisateur
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Liste des notifications de l'utilisateur
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Notification'
     *       500:
     *         description: Erreur serveur
     */

    router.get('/user/:userId', controller.getByUserId);

    /**
     * @openapi
     * /api/notifications/user/{userId}/unread:
     *   get:
     *     tags: [Notifications]
     *     summary: Recuperer les notifications non lues d'un utilisateur
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Liste des notifications non lues
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Notification'
     *       500:
     *         description: Erreur serveur
     */

    router.get('/user/:userId/unread', controller.getUnreadByUserId);

    /**
     * @openapi
     * /api/notifications/{id}:
     *   get:
     *     tags: [Notifications]
     *     summary: Recuperer une notification par id
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Notification trouvee
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Notification'
     *       404:
     *         description: Notification non trouvee
     *       500:
     *         description: Erreur serveur
     */

    router.get('/:id', controller.getById);

    /**
     * @openapi
     * /api/notifications:
     *   post:
     *     tags: [Notifications]
     *     summary: Creer une notification
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateNotificationDTO'
     *     responses:
     *       201:
     *         description: Notification creee
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Notification'
     *       400:
     *         description: Requete invalide
     */

    router.post('/', controller.create);

    /**
     * @openapi
     * /api/notifications/{id}:
     *   put:
     *     tags: [Notifications]
     *     summary: Mettre a jour une notification
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
     *             $ref: '#/components/schemas/UpdateNotificationDTO'
     *     responses:
     *       200:
     *         description: Notification mise a jour
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Notification'
     *       404:
     *         description: Notification non trouvee
     *       400:
     *         description: Requete invalide
     */

    router.put('/:id', controller.updateById);

    /**
     * @openapi
     * /api/notifications/{id}/read:
     *   patch:
     *     tags: [Notifications]
     *     summary: Marquer une notification comme lue
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Notification marquee comme lue
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Notification'
     *       404:
     *         description: Notification non trouvee
     *       400:
     *         description: Requete invalide
     */

    router.patch('/:id/read', controller.markAsRead);

    /**
     * @openapi
     * /api/notifications/{id}:
     *   delete:
     *     tags: [Notifications]
     *     summary: Supprimer une notification
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Notification supprimee
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Notification'
     *       404:
     *         description: Notification non trouvee
     *       500:
     *         description: Erreur serveur
     */

    router.delete('/:id', controller.deleteById);

    return router;
};
