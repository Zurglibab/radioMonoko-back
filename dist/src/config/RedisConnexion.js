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
exports.testData = testData;
exports.getData = getData;
const redis_1 = require("redis");
// URL configurable via la variable d'environnement REDIS_URL
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const client = (0, redis_1.createClient)({ url: redisUrl });
client.on('error', (err) => console.error('Redis Client Error', err));
client.on('connect', () => console.log('Redis client connecting...'));
client.on('ready', () => console.log('Redis client ready'));
client.on('end', () => console.log('Redis connection closed'));
// Connexion à Redis
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!client.isOpen) {
                yield client.connect();
                console.log('Connected to Redis');
            }
            else {
                console.log('Redis client already connected');
            }
        }
        catch (err) {
            console.error('Failed to connect to Redis:', err);
            throw err;
        }
    });
}
// Déconnexion de Redis
function disconnect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (client.isOpen) {
                yield client.quit();
            }
        }
        catch (err) {
            console.error('Error disconnecting Redis:', err);
        }
    });
}
// Exemple de fonction pour stocker et récupérer des données structurées (hash)
function testData(session, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = Object.assign({}, data);
            yield client.hSet(session, payload);
            // On récupère et renvoie le hash stocké pour validation
            const result = yield client.hGetAll(session);
            console.log(`Stored hash for ${session}:`, result);
            return result;
        }
        catch (err) {
            console.error('Error storing data in Redis:', err);
            throw err;
        }
    });
}
function getData(session) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield client.hGetAll(session);
        }
        catch (err) {
            console.error('Error retrieving data from Redis:', err);
        }
    });
}
exports.default = client;
//# sourceMappingURL=RedisConnexion.js.map