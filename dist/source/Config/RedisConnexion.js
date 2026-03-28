"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = connect;
exports.disconnect = disconnect;
exports.getClient = getClient;
exports.isConnected = isConnected;
const redis_1 = require("redis");
// URL configurable via la variable d'environnement REDIS_URL
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const client = (0, redis_1.createClient)({ url: redisUrl });
client.on('error', (err) => console.error('[RedisConnexion] Client Error', err));
client.on('connect', () => console.log('[RedisConnexion] Client connecting...'));
client.on('ready', () => console.log('[RedisConnexion] Client ready'));
client.on('end', () => console.log('[RedisConnexion] Connection closed'));
/**
 * Connexion à Redis
 */
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!client.isOpen) {
                yield client.connect();
                console.log('[RedisConnexion] Connected to Redis');
            }
            else {
                console.log('[RedisConnexion] Redis client already connected');
            }
        }
        catch (err) {
            console.error('[RedisConnexion] Failed to connect to Redis:', err);
            throw err;
        }
    });
}
/**
 * Déconnexion de Redis
 */
function disconnect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (client.isOpen) {
                yield client.quit();
                console.log('[RedisConnexion] Disconnected from Redis');
            }
        }
        catch (err) {
            console.error('[RedisConnexion] Error disconnecting Redis:', err);
        }
    });
}
/**
 * Récupère l'instance du client Redis
 */
function getClient() {
    return client;
}
/**
 * Vérifie si le client est connecté
 */
function isConnected() {
    return client.isOpen;
}
exports.default = client;
//# sourceMappingURL=RedisConnexion.js.map