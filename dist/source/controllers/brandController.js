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
exports.getAllBrands = getAllBrands;
exports.getBrandById = getBrandById;
exports.searchBrands = searchBrands;
exports.refreshBrands = refreshBrands;
exports.getBrandsCount = getBrandsCount;
exports.clearBrandsCache = clearBrandsCache;
exports.health = health;
const brandsServices_1 = require("../Services/brandsServices");
const redisDAO_1 = require("../DAO/redisDAO");
/**
 * GET /api/brands
 * Récupère toutes les brands (Redis en priorité, fallback API)
 */
function getAllBrands(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("[apiController] GET /api/brands");
            const brands = yield brandsServices_1.brandApiService.getBrandsWithFallback();
            res.status(200).json({
                success: true,
                data: brands,
                count: brands.length
            });
        }
        catch (error) {
            console.error("[apiController] getAllBrands failed:", error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Failed to fetch brands"
            });
        }
    });
}
/**
 * GET /api/brands/:id
 * Récupère une brand spécifique par son ID
 */
function getBrandById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            console.log(`[apiController] GET /api/brands/${id}`);
            const brand = yield redisDAO_1.redisDao.getById(id);
            if (!brand) {
                return res.status(404).json({
                    success: false,
                    error: `Brand with id "${id}" not found`
                });
            }
            res.status(200).json({
                success: true,
                data: brand
            });
        }
        catch (error) {
            console.error("[apiController] getBrandById failed:", error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Failed to fetch brand"
            });
        }
    });
}
/**
 * GET /api/brands/search/:title
 * Recherche les brands par titre (partiel)
 */
function searchBrands(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title } = req.params;
            console.log(`[apiController] GET /api/brands/search/${title}`);
            const allBrands = yield brandsServices_1.brandApiService.getBrandsWithFallback();
            const filtered = allBrands.filter((brand) => brand.title.toLowerCase().includes(title.toLowerCase()));
            res.status(200).json({
                success: true,
                data: filtered,
                count: filtered.length,
                query: title
            });
        }
        catch (error) {
            console.error("[apiController] searchBrands failed:", error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Search failed"
            });
        }
    });
}
/**
 * POST /api/brands/refresh
 * Force un refresh des brands depuis l'API vers Redis
 */
function refreshBrands(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("[apiController] POST /api/brands/refresh");
            const brands = yield brandsServices_1.brandApiService.refreshBrandsFromApiToRedis();
            res.status(200).json({
                success: true,
                message: `Successfully refreshed ${brands.length} brands`,
                data: brands,
                count: brands.length,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error("[apiController] refreshBrands failed:", error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Refresh failed"
            });
        }
    });
}
/**
 * GET /api/brands/stats/count
 * Récupère le nombre total de brands
 */
function getBrandsCount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("[apiController] GET /api/brands/stats/count");
            const count = yield redisDAO_1.redisDao.count();
            res.status(200).json({
                success: true,
                data: {
                    total: count,
                    timestamp: new Date().toISOString()
                }
            });
        }
        catch (error) {
            console.error("[apiController] getBrandsCount failed:", error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Failed to count brands"
            });
        }
    });
}
/**
 * DELETE /api/brands/cache
 * Vide le cache Redis des brands
 */
function clearBrandsCache(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("[apiController] DELETE /api/brands/cache");
            yield brandsServices_1.brandApiService.deleteBrandsFromRedis();
            res.status(200).json({
                success: true,
                message: "Brands cache cleared successfully",
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error("[apiController] clearBrandsCache failed:", error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Failed to clear cache"
            });
        }
    });
}
/**
 * GET /api/health
 * Check la santé de l'API
 */
function health(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const count = yield redisDAO_1.redisDao.count();
            res.status(200).json({
                success: true,
                status: "healthy",
                redis: {
                    connected: true,
                    brands_cached: count
                },
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            res.status(503).json({
                success: false,
                status: "unhealthy",
                error: error instanceof Error ? error.message : "Redis connection failed"
            });
        }
    });
}
//# sourceMappingURL=brandController.js.map