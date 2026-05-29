import { createClient, RedisClientType } from 'redis';
import logger from './logger';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redisUrl = `redis://${redisHost}:${redisPort}`;
const redisPassword = process.env.REDIS_PASSWORD?.trim();

const clientOptions = redisPassword ? { url: redisUrl, password: redisPassword } : { url: redisUrl };

const client: RedisClientType = createClient(clientOptions as any);

client.on('error', (err) => logger.error('[RedisConnexion] Client Error ' + err));
client.on('connect', () => logger.info('[RedisConnexion] Client connecting...'));
client.on('ready', () => logger.info('[RedisConnexion] Client ready'));
client.on('end', () => logger.info('[RedisConnexion] Connection closed'));




export async function connect() {
  try {
    if (!client.isOpen) {
      await client.connect();
      logger.info('[RedisConnexion] Connected to Redis');
    } else {
      logger.info('[RedisConnexion] Redis client already connected');
    }
  } catch (err) {
    console.error('[RedisConnexion] Failed to connect to Redis:', err);
    throw err;
  }
}




export async function disconnect() {
  try {
    if (client.isOpen) {
      await client.quit();
      logger.info('[RedisConnexion] Disconnected from Redis');
    }
  } catch (err) {
    console.error('[RedisConnexion] Error disconnecting Redis:', err);
  }
}




export function getClient(): RedisClientType {
  return client;
}




export function isConnected(): boolean {
  return client.isOpen;
}


export default client;