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
exports.redisShowDao = exports.ShowDAO = void 0;
const RedisConnexion_1 = require("../Config/RedisConnexion");
const client = (0, RedisConnexion_1.getClient)();
class ShowDAO {
    getShowsKey(station) {
        return `shows:${station}`;
    }
    getShowIdKey(station, showId) {
        return `show:${station}:${showId}`;
    }
    getShowIdsKey(station) {
        return `show:ids:${station}`;
    }
    ensureConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, RedisConnexion_1.connect)();
        });
    }
    /**
     * Sauvegarde tous les shows pour une station dans Redis
     */
    saveAllByStation(station, shows) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureConnected();
                const showsKey = this.getShowsKey(station);
                const idsKey = this.getShowIdsKey(station);
                // Sauvegarde du JSON complet
                yield client.set(showsKey, JSON.stringify(shows));
                // Sauvegarde des IDs dans un set
                yield client.del(idsKey);
                const ids = shows.map((s) => s.id);
                if (ids.length > 0) {
                    yield client.sAdd(idsKey, ids);
                }
                // Sauvegarde de chaque show comme hash
                for (const show of shows) {
                    const key = this.getShowIdKey(station, show.id);
                    const hashPayload = {
                        id: show.id,
                        title: show.title || "",
                        diffusions: JSON.stringify(show.diffusions || []),
                        taxonomies: JSON.stringify(show.taxonomies || [])
                    };
                    yield client.hSet(key, hashPayload);
                }
                console.log(`[RedisShowDao] Saved ${shows.length} shows for station ${station}`);
            }
            catch (error) {
                console.error("[ShowDAO] Failed to save shows:", error);
                throw error;
            }
        });
    }
    /**
     * Récupère tous les shows pour une station depuis Redis
     */
    getAllByStation(station) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureConnected();
                const showsKey = this.getShowsKey(station);
                const jsonData = yield client.get(showsKey);
                if (!jsonData || typeof jsonData !== "string") {
                    console.log(`[RedisShowDao] No shows found for station ${station}`);
                    return null;
                }
                const shows = JSON.parse(jsonData);
                console.log(`[RedisShowDao] Retrieved ${shows.length} shows for station ${station}`);
                return shows;
            }
            catch (error) {
                console.error("[ShowDAO] Failed to get shows:", error);
                throw error;
            }
        });
    }
    /**
     * Récupère un show spécifique par son ID
     */
    getByIdAndStation(station, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureConnected();
                const key = this.getShowIdKey(station, id);
                const hashData = yield client.hGetAll(key);
                if (!hashData || Object.keys(hashData).length === 0) {
                    console.log(`[RedisShowDao] No show found with id ${id} for station ${station}`);
                    return null;
                }
                const show = {
                    id: hashData.id || id,
                    title: hashData.title || "",
                    diffusions: hashData.diffusions ? JSON.parse(hashData.diffusions) : [],
                    taxonomies: hashData.taxonomies ? JSON.parse(hashData.taxonomies) : []
                };
                return show;
            }
            catch (error) {
                console.error("[ShowDAO] Failed to get show by id:", error);
                throw error;
            }
        });
    }
    /**
     * Récupère tous les IDs des shows pour une station
     */
    getAllIdsByStation(station) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureConnected();
                const idsKey = this.getShowIdsKey(station);
                const ids = yield client.sMembers(idsKey);
                console.log(`[RedisShowDao] Retrieved ${ids.length} show IDs for station ${station}`);
                return ids;
            }
            catch (error) {
                console.error("[ShowDAO] Failed to get show IDs:", error);
                throw error;
            }
        });
    }
    /**
     * Supprime un show spécifique
     */
    deleteByIdAndStation(station, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureConnected();
                const key = this.getShowIdKey(station, id);
                const idsKey = this.getShowIdsKey(station);
                yield client.del(key);
                yield client.sRem(idsKey, id);
                console.log(`[RedisShowDao] Deleted show with id ${id} for station ${station}`);
            }
            catch (error) {
                console.error("[ShowDAO] Failed to delete show:", error);
                throw error;
            }
        });
    }
    /**
     * Supprime tous les shows pour une station
     */
    deleteAllByStation(station) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureConnected();
                const showsKey = this.getShowsKey(station);
                const idsKey = this.getShowIdsKey(station);
                const ids = yield client.sMembers(idsKey);
                yield client.del(showsKey);
                yield client.del(idsKey);
                for (const id of ids) {
                    yield client.del(this.getShowIdKey(station, id));
                }
                console.log(`[RedisShowDao] Deleted all shows for station ${station}`);
            }
            catch (error) {
                console.error("[ShowDAO] Failed to delete all shows:", error);
                throw error;
            }
        });
    }
    /**
     * Vérifie si un show existe
     */
    existsByIdAndStation(station, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureConnected();
                const idsKey = this.getShowIdsKey(station);
                const exists = yield client.sIsMember(idsKey, id);
                return exists === 1;
            }
            catch (error) {
                console.error("[ShowDAO] Failed to check if show exists:", error);
                throw error;
            }
        });
    }
    /**
     * Récupère le nombre total de shows pour une station
     */
    countByStation(station) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureConnected();
                const idsKey = this.getShowIdsKey(station);
                const count = yield client.sCard(idsKey);
                return count;
            }
            catch (error) {
                console.error("[ShowDAO] Failed to count shows:", error);
                throw error;
            }
        });
    }
}
exports.ShowDAO = ShowDAO;
// Export singleton
exports.redisShowDao = new ShowDAO();
//# sourceMappingURL=showDAO.js.map