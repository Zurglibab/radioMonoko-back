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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisDao = exports.BrandDAO = void 0;
const RedisConnexion_1 = require("../Config/RedisConnexion");
const RedisConnexion_2 = __importDefault(require("../Config/RedisConnexion"));
class BrandDAO {
    constructor() {
        this.allBrandsKey = "brands:all";
        this.brandIdsKey = "brands:ids";
    }
    ensureConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, RedisConnexion_1.connect)();
        });
    }
    /**
     * Sauvegarde toutes les brands dans Redis
     */
    saveAll(brands) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureConnected();
                // Sauvegarde du JSON complet
                yield RedisConnexion_2.default.set(this.allBrandsKey, JSON.stringify(brands));
                // Sauvegarde des IDs dans un set
                yield RedisConnexion_2.default.del(this.brandIdsKey);
                const ids = brands.map((b) => b.id);
                if (ids.length > 0) {
                    yield RedisConnexion_2.default.sAdd(this.brandIdsKey, ids);
                }
                // Sauvegarde de chaque brand comme hash
                for (const brand of brands) {
                    const key = `brand:${brand.id}`;
                    const hashPayload = {
                        id: brand.id,
                        title: brand.title || "",
                        baseline: brand.baseline || "",
                        description: brand.description || "",
                        websiteUrl: brand.websiteUrl || "",
                        liveStream: brand.liveStream || "",
                        playerUrl: brand.playerUrl || ""
                    };
                    yield RedisConnexion_2.default.hSet(key, hashPayload);
                    // Stocker les radios en JSON
                    if (brand.webRadios && brand.webRadios.length > 0) {
                        yield RedisConnexion_2.default.hSet(key, {
                            webRadios: JSON.stringify(brand.webRadios)
                        });
                    }
                    if (brand.localRadios && brand.localRadios.length > 0) {
                        yield RedisConnexion_2.default.hSet(key, {
                            localRadios: JSON.stringify(brand.localRadios)
                        });
                    }
                }
                console.log(`[RedisDao] Saved ${brands.length} brands to Redis`);
            }
            catch (error) {
                console.error("[BrandDAO] Failed to save brands:", error);
                throw error;
            }
        });
    }
    /**
     * Récupère toutes les brands depuis Redis
     */
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureConnected();
                const jsonData = yield RedisConnexion_2.default.get(this.allBrandsKey);
                if (!jsonData || typeof jsonData !== "string") {
                    console.log("[BrandDAO] No brands found in Redis");
                    return null;
                }
                const brands = JSON.parse(jsonData);
                console.log(`[RedisDao] Retrieved ${brands.length} brands from Redis`);
                return brands;
            }
            catch (error) {
                console.error("[BrandDAO] Failed to get brands:", error);
                throw error;
            }
        });
    }
    /**
     * Récupère une brand spécifique par son ID
     */
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureConnected();
                const key = `brand:${id}`;
                const hashData = yield RedisConnexion_2.default.hGetAll(key);
                if (!hashData || Object.keys(hashData).length === 0) {
                    console.log(`[RedisDao] No brand found with id ${id}`);
                    return null;
                }
                const brand = {
                    id: hashData.id || id,
                    title: hashData.title || "",
                    baseline: hashData.baseline,
                    description: hashData.description,
                    websiteUrl: hashData.websiteUrl,
                    liveStream: hashData.liveStream,
                    playerUrl: hashData.playerUrl,
                    webRadios: hashData.webRadios ? JSON.parse(hashData.webRadios) : [],
                    localRadios: hashData.localRadios ? JSON.parse(hashData.localRadios) : []
                };
                return brand;
            }
            catch (error) {
                console.error(`[RedisDao] Failed to get brand by id ${id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Récupère tous les IDs des brands
     */
    getAllIds() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureConnected();
                const ids = yield RedisConnexion_2.default.sMembers(this.brandIdsKey);
                console.log(`[RedisDao] Retrieved ${ids.length} brand IDs from Redis`);
                return ids;
            }
            catch (error) {
                console.error("[BrandDAO] Failed to get brand IDs:", error);
                throw error;
            }
        });
    }
    /**
     * Supprime une brand spécifique
     */
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureConnected();
                const key = `brand:${id}`;
                yield RedisConnexion_2.default.del(key);
                yield RedisConnexion_2.default.sRem(this.brandIdsKey, id);
                console.log(`[RedisDao] Deleted brand with id ${id}`);
            }
            catch (error) {
                console.error(`[RedisDao] Failed to delete brand with id ${id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Supprime toutes les brands
     */
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureConnected();
                const ids = yield RedisConnexion_2.default.sMembers(this.brandIdsKey);
                yield RedisConnexion_2.default.del(this.allBrandsKey);
                yield RedisConnexion_2.default.del(this.brandIdsKey);
                for (const id of ids) {
                    yield RedisConnexion_2.default.del(`brand:${id}`);
                }
                console.log("[BrandDAO] Deleted all brands from Redis");
            }
            catch (error) {
                console.error("[BrandDAO] Failed to delete all brands:", error);
                throw error;
            }
        });
    }
    /**
     * Vérifie si une brand existe
     */
    exists(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureConnected();
                const exists = yield RedisConnexion_2.default.sIsMember(this.brandIdsKey, id);
                return exists === 1;
            }
            catch (error) {
                console.error(`[RedisDao] Failed to check if brand exists:`, error);
                throw error;
            }
        });
    }
    /**
     * Récupère le nombre total de brands
     */
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureConnected();
                const count = yield RedisConnexion_2.default.sCard(this.brandIdsKey);
                return count;
            }
            catch (error) {
                console.error("[BrandDAO] Failed to count brands:", error);
                throw error;
            }
        });
    }
}
exports.BrandDAO = BrandDAO;
// Export singleton
exports.redisDao = new BrandDAO();
//# sourceMappingURL=brandDAO.js.map