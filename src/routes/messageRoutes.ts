import { Router } from 'express';
import { MessageDAO } from '../DAO/messageDAO';
import { MessageService } from '../services/messageService';
import { MessageController } from '../controllers/message.controller';
import { ChannelDAO } from '../DAO/channelDAO';
import { ChannelService } from '../services/channelService';

const messageRoutes = () => {
    const router = Router();

    const channelRepository = new ChannelDAO();
    const channelService = new ChannelService(channelRepository);

    const messageRepository = new MessageDAO();
    const messageService = new MessageService(messageRepository, channelService);
    const controller = new MessageController(messageService);

    /**
     * @openapi
     * components:
     *   schemas:
     *     Message:
     *       type: object
     *       required: [id, channel_id, sender_id, content, created_at]
     *       properties:
     *         id:
     *           type: string
     *           format: uuid
     *         channel_id:
     *           type: string
     *           format: uuid
     *         sender_id:
     *           type: string
     *           format: uuid
     *         content:
     *           type: string
     *         created_at:
     *           type: string
     *           format: date-time
     *     CreateMessageBody:
     *       type: object
     *       required: [content]
     *       properties:
     *         content:
     *           type: string
     *         senderId:
     *           type: string
     *           description: Fallback si pas d'auth (req.user)
     */

    /**
     * @openapi
     * /channels/{channelId}/messages:
     *   get:
     *     summary: Lister les messages d'un channel
     *     tags: [Messages]
     *     parameters:
     *       - in: path
     *         name: channelId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 50
     *       - in: query
     *         name: before
     *         schema:
     *           type: string
     *           format: date-time
     *     responses:
     *       200:
     *         description: Liste des messages
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Message'
     *       404:
     *         description: Channel introuvable
     */
    router.get('/:channelId/messages', controller.getMessagesByChannel);

    /**
     * @openapi
     * /channels/{channelId}/messages:
     *   post:
     *     summary: Envoyer un message dans un channel
     *     tags: [Messages]
     *     parameters:
     *       - in: path
     *         name: channelId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateMessageBody'
     *     responses:
     *       201:
     *         description: Message créé
     */
    router.post('/:channelId/messages', controller.sendMessage);

    /**
     * @openapi
     * /channels/{channelId}/messages/{messageId}:
     *   get:
     *     summary: Récupérer un message
     *     tags: [Messages]
     *     parameters:
     *       - in: path
     *         name: channelId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *       - in: path
     *         name: messageId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Message
     *       404:
     *         description: Not found
     */
    router.get('/:channelId/messages/:messageId', controller.getMessage);

    /**
     * @openapi
     * /channels/{channelId}/messages/{messageId}:
     *   patch:
     *     summary: Mettre à jour un message
     *     tags: [Messages]
     *     parameters:
     *       - in: path
     *         name: channelId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *       - in: path
     *         name: messageId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               content:
     *                 type: string
     *     responses:
     *       200:
     *         description: Message mis à jour
     *       404:
     *         description: Not found
     */
    router.patch('/:channelId/messages/:messageId', controller.updateMessage);

    /**
     * @openapi
     * /channels/{channelId}/messages/{messageId}:
     *   delete:
     *     summary: Supprimer un message
     *     tags: [Messages]
     *     parameters:
     *       - in: path
     *         name: channelId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *       - in: path
     *         name: messageId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Supprimé
     *       404:
     *         description: Not found
     */
    router.delete('/:channelId/messages/:messageId', controller.deleteMessage);

    return router;
};

export default messageRoutes;
