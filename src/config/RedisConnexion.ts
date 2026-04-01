import { createClient, RedisClientType } from 'redis';

// URL configurable via la variable d'environnement REDIS_URL
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redisUrl = `redis://${redisHost}:${redisPort}`;
const redisPassword = process.env.REDIS_PASSWORD;

const client: RedisClientType = createClient({ url: redisUrl, password: redisPassword});

client.on('error', (err) => console.error('[RedisConnexion] Client Error', err));
client.on('connect', () => console.log('[RedisConnexion] Client connecting...'));
client.on('ready', () => console.log('[RedisConnexion] Client ready'));
client.on('end', () => console.log('[RedisConnexion] Connection closed'));

/**
 * Connexion à Redis
 */
export async function connect() {
    try {
        if (!client.isOpen) {
            await client.connect();
            console.log('[RedisConnexion] Connected to Redis');
        } else {
            console.log('[RedisConnexion] Redis client already connected');
        }
    } catch (err) {
        console.error('[RedisConnexion] Failed to connect to Redis:', err);
        throw err;
    }
}

/**
 * Déconnexion de Redis
 */
export async function disconnect() {
    try {
        if (client.isOpen) {
            await client.quit();
            console.log('[RedisConnexion] Disconnected from Redis');
        }
    } catch (err) {
        console.error('[RedisConnexion] Error disconnecting Redis:', err);
    }
}

/**
 * Récupère l'instance du client Redis
 */
export function getClient(): RedisClientType {
    return client;
}

/**
 * Vérifie si le client est connecté
 */
export function isConnected(): boolean {
    return client.isOpen;
}


export default client;
