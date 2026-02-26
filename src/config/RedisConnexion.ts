import {createClient, RedisClientType} from 'redis';
import {dataTest} from "../interface/RedisInterface";

// URL configurable via la variable d'environnement REDIS_URL
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const client: RedisClientType = createClient({ url: redisUrl });

client.on('error', (err) => console.error('Redis Client Error', err));
client.on('connect', () => console.log('Redis client connecting...'));
client.on('ready', () => console.log('Redis client ready'));
client.on('end', () => console.log('Redis connection closed'));

// Connexion à Redis
export async function connect() {
    try {
        if (!client.isOpen) {
            await client.connect();
            console.log('Connected to Redis');
        } else {
            console.log('Redis client already connected');
        }
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
        throw err;
    }
}

// Déconnexion de Redis
export async function disconnect() {
    try {
        if (client.isOpen) {
            await client.quit();
        }
    }
    catch (err) {
        console.error('Error disconnecting Redis:', err);
    }
}

// Exemple de fonction pour stocker et récupérer des données structurées (hash)
export async function storeDataTest(session: string, data: dataTest){
    try {
        const payload = {
            ...data,
        }
        await client.hSet(session, payload);

        // On récupère et renvoie le hash stocké pour validation
        const result = await client.hGetAll(session);
        console.log(`Stored hash for ${session}:`, result);
        return result;
    }
    catch (err) {
        console.error('Error storing data in Redis:', err);
        throw err;
    }
}

export async function getDataTest(session: string){
    try {
        return await client.hGetAll(session);
    }
    catch (err) {
        console.error('Error retrieving data from Redis:', err);
    }
}

export async function deleteData(session: string) {
    try {
        await client.del(session);
        console.log(`Deleted data for session ${session}`);
    }
    catch (err) {
        console.error('Error deleting data from Redis:', err);
    }
}


export default client;
