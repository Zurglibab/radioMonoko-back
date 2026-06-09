import { Router } from 'express';
import { ChannelDAO } from '../DAO/channelDAO';
import { ChannelService } from '../services/channelService';
import { ChannelController } from '../controllers/channel.controller';
import {authMiddleware} from "../middlewares/auth.middleware";

const channelRoutes = () => {
    const router = Router();
    const repository = new ChannelDAO();
    const service = new ChannelService(repository);
    const controller = new ChannelController(service);

    /**
     * @openapi
     * /channels:
     *   post:
     *     summary: Créer un channel
     *     tags: [Channels]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateChannelDTO'
     *     responses:
     *       201:
     *         description: Channel créé
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Channel'
     *       400:
     *         description: Validation error
     */
    router.post('/', authMiddleware, controller.createChannel);

    /**
     * @openapi
     * /channels:
     *   get:
     *     summary: Lister les channels
     *     tags: [Channels]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Liste des channels
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Channel'
     */
    router.get('/', authMiddleware,  controller.listChannels);

    /**
     * @openapi
     * /channels/{channelId}:
     *   get:
     *     summary: Récupérer un channel
     *     tags: [Channels]
     *     parameters:
     *       - in: path
     *         name: channelId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Channel
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Channel'
     *       404:
     *         description: Not found
     */
    router.get('/:channelId', controller.getChannel);

    /**
     * @openapi
     * /channels/{channelId}:
     *   patch:
     *     summary: Mettre à jour un channel
     *     tags: [Channels]
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
     *             type: object
     *             properties:
     *               type:
     *                 type: string
     *     responses:
     *       200:
     *         description: Channel mis à jour
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Channel'
     *       404:
     *         description: Not found
     */
    router.patch('/:channelId', controller.updateChannel);

    /**
     * @openapi
     * /channels/{channelId}:
     *   delete:
     *     summary: Supprimer un channel
     *     tags: [Channels]
     *     parameters:
     *       - in: path
     *         name: channelId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Channel supprimé
     *       404:
     *         description: Not found
     */
    router.delete('/:channelId', controller.deleteChannel);

    /**
     * @openapi
     * /channels/{channelId}/members:
     *   post:
     *     summary: Ajouter un utilisateur au channel
     *     tags: [Members]
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
     *             type: object
     *             required: [userId]
     *             properties:
     *               userId:
     *                 type: string
     *                 format: uuid
     *     responses:
     *       201:
     *         description: Membre ajouté
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ChannelMember'
     *       404:
     *         description: Channel introuvable
     */
    router.post('/:channelId/members', controller.addMember);

    /**
     * @openapi
     * /channels/{channelId}/members:
     *   get:
     *     summary: Lister les membres d'un channel
     *     tags: [Members]
     *     parameters:
     *       - in: path
     *         name: channelId
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Liste des membres
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/ChannelMember'
     *       404:
     *         description: Channel introuvable
     */
    router.get('/:channelId/members', controller.listMembers);

    /**
     * @openapi
     * /channels/{channelId}/members/{userId}:
     *   delete:
     *     summary: Retirer un utilisateur du channel
     *     tags: [Members]
     *     parameters:
     *       - in: path
     *         name: channelId
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
     *         description: Membre retiré
     *       404:
     *         description: Not found
     */
    router.delete('/:channelId/members/:userId', controller.removeMember);

    return router;
};

export default channelRoutes;
