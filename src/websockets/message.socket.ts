import { Server } from 'socket.io';
import { createClient } from 'redis';
import logger from '../config/logger';
import { ChannelDAO } from '../DAO/channelDAO';
import { ChannelService } from '../services/channelService';
import { MessageDAO } from '../DAO/messageDAO';
import { MessageService } from '../services/messageService';

// Initialisation du client Redis (ajustez l'URL selon votre configuration si nécessaire)
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => logger.error('[Redis] Error', err));

// Connexion asynchrone à Redis au démarrage
redisClient.connect().then(() => {
    logger.info('[Redis] Connected successfully');
}).catch((err) => {
    logger.error('[Redis] Connection failed', err);
});

export async function setupWebSockets(server: any) {
    const io = new Server(server, { cors: { origin: '*' } });

    // Permet de simuler ou de récupérer l'instance globale de IO si nécessaire ailleurs
    const getIO = () => io;

    const channelRepository = new ChannelDAO();
    const channelService = new ChannelService(channelRepository);
    const messageRepository = new MessageDAO();
    const messageService = new MessageService(messageRepository, channelService);

    io.on('connection', (socket) => {
        const authUserId = (socket.handshake.auth as any)?.userId as string | undefined;
        logger.info(`[socket] connected: socketId=${socket.id} userId=${authUserId ?? 'anonymous'}`);

        // Rejoindre un canal et l'enregistrer dans Redis
        socket.on('joinChannel', async (channelId: string) => {
            const roomName = `channel:${channelId}`;
            socket.join(roomName);

            try {
                const redisKey = `channel:${channelId}:sockets`;
                const memberIdentifier = authUserId ? `${authUserId}:${socket.id}` : `anonymous:${socket.id}`;

                await redisClient.sAdd(redisKey, memberIdentifier);
                logger.info(`[Redis] Added socket ${socket.id} to ${redisKey}`);
            } catch (err) {
                logger.error(`[Redis] Error adding socket to channel ${channelId}`, err);
            }
        });

        // Quitter un canal et le retirer de Redis
        socket.on('leaveChannel', async (channelId: string) => {
            const roomName = `channel:${channelId}`;
            socket.leave(roomName);

            try {
                const redisKey = `channel:${channelId}:sockets`;
                const memberIdentifier = authUserId ? `${authUserId}:${socket.id}` : `anonymous:${socket.id}`;

                await redisClient.sRem(redisKey, memberIdentifier);
                logger.info(`[Redis] Removed socket ${socket.id} from ${redisKey}`);
            } catch (err) {
                logger.error(`[Redis] Error removing socket from channel ${channelId}`, err);
            }
        });

        // Envoi de message via socket (persisté en Postgres + émis via getIO())
        socket.on('sendMessage', async (payload: any, ack?: Function) => {
            try {
                const channelId = String(payload?.channelId ?? '');
                const content = String(payload?.content ?? '');
                const userId = String(payload?.userId ?? authUserId ?? '');

                if (!channelId) throw new Error('channelId is required');
                if (!userId) throw new Error('userId is required');
                if (!content.trim()) throw new Error('content is required');

                // Enregistrement en base de données
                const message = await messageService.createInChannel(channelId, userId, content);

                // Envoi à tous les sockets du channel avec gestion d'absence d'initialisation
                try {
                    getIO().to(`channel:${channelId}`).emit('newMessage', message);
                    logger.info(`Message sent in channel ${channelId}: ${message.id}`);
                } catch (e) {
                    // Socket.IO pas initialisé (ex: tests) -> on ignore
                }

                ack?.({ success: true, data: message });
            } catch (e: any) {
                ack?.({ success: false, error: e?.message ?? 'Internal error' });
            }
        });

        // Récupération historique via socket
        socket.on('getMessages', async (payload: any, ack?: Function) => {
            try {
                const channelId = String(payload?.channelId ?? '');
                if (!channelId) throw new Error('channelId is required');

                const limit = payload?.limit ? Number(payload.limit) : 50;
                const before = payload?.before ? String(payload.before) : undefined;

                const messages = await messageService.listByChannelId(channelId, limit, before);
                ack?.({ success: true, data: messages });
            } catch (e: any) {
                ack?.({ success: false, error: e?.message ?? 'Internal error' });
            }
        });

        // Déconnexion et nettoyage global dans Redis
        socket.on('disconnect', async (reason) => {
            logger.info(`[socket] disconnected: socketId=${socket.id} reason=${reason}`);

            try {
                const memberIdentifier = authUserId ? `${authUserId}:${socket.id}` : `anonymous:${socket.id}`;
                const keys = await redisClient.keys('channel:*:sockets');

                for (const key of keys) {
                    const removed = await redisClient.sRem(key, memberIdentifier);
                    if (removed > 0) {
                        logger.info(`[Redis] Cleaned up disconnected socket ${socket.id} from ${key}`);
                    }
                }
            } catch (err) {
                logger.error(`[Redis] Error during disconnect cleanup for socket ${socket.id}`, err);
            }
        });
    });

    return io;
}