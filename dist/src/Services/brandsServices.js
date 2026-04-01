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
exports.brandApiService = exports.BrandApiService = void 0;
const brandsRepository_1 = require("../repository/brandsRepository");
const brandDAO_1 = require("../DAO/brandDAO");
class BrandApiService {
    constructor() {
        this.apiRepository = new brandsRepository_1.BrandsRepository();
        this.redisDao = new brandDAO_1.BrandDAO();
    }
    /**
     * Récupère les brands depuis l'API et les stocke dans Redis
     */
    refreshBrandsFromApiToRedis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("[BrandApiService] Fetching brands from API...");
                const brands = yield this.apiRepository.getBrands();
                console.log(`[BrandApiService] Got ${brands.length} brands, storing in Redis...`);
                yield this.redisDao.saveAll(brands);
                console.log("[BrandApiService] Brands successfully stored in Redis");
                return brands;
            }
            catch (error) {
                console.error("[BrandApiService] Failed to refresh brands:", error);
                throw error;
            }
        });
    }
    /**
     * Récupère les brands depuis Redis
     */
    getBrandsFromRedis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("[BrandApiService] Fetching brands from Redis...");
                const brands = yield this.redisDao.getAll();
                if (!brands) {
                    console.log("[BrandApiService] No brands found in Redis");
                    return null;
                }
                console.log(`[BrandApiService] Retrieved ${brands.length} brands from Redis`);
                return brands;
            }
            catch (error) {
                console.error("[BrandApiService] Failed to get brands from Redis:", error);
                throw error;
            }
        });
    }
    /**
     * Récupère les brands depuis Redis, sinon les récupère depuis l'API
     */
    getBrandsWithFallback() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Essayer Redis d'abord
                const cachedBrands = yield this.getBrandsFromRedis();
                if (cachedBrands && cachedBrands.length > 0) {
                    return cachedBrands;
                }
                // Fallback sur API
                console.log("[BrandApiService] Cache miss, fetching from API...");
                return yield this.refreshBrandsFromApiToRedis();
            }
            catch (error) {
                console.error("[BrandApiService] Failed with fallback:", error);
                throw error;
            }
        });
    }
    /**
     * Supprime les brands de Redis
     */
    deleteBrandsFromRedis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("[BrandApiService] Deleting brands from Redis...");
                yield this.redisDao.deleteAll();
                console.log("[BrandApiService] Brands successfully deleted from Redis");
            }
            catch (error) {
                console.error("[BrandApiService] Failed to delete brands:", error);
                throw error;
            }
        });
    }
}
exports.BrandApiService = BrandApiService;
// Export singleton pour utilisation simplifiée
exports.brandApiService = new BrandApiService();
//# sourceMappingURL=brandsServices.js.map