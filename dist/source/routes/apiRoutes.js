"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const brandController_1 = require("../controllers/brandController");
const showRoutes_1 = __importDefault(require("./showRoutes"));
const diffusionRoutes_1 = __importDefault(require("./diffusionRoutes"));
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Health check API
 *     responses:
 *       200:
 *         description: API en ligne
 */
router.get("/health", brandController_1.health);
/**
 * @openapi
 * /api/brands:
 *   get:
 *     tags: [Brands]
 *     summary: Recuperer toutes les brands
 *     responses:
 *       200:
 *         description: Liste des brands
 */
router.get("/brands", brandController_1.getAllBrands);
/**
 * @openapi
 * /api/brands/{id}:
 *   get:
 *     tags: [Brands]
 *     summary: Recuperer une brand par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand trouvee
 */
router.get("/brands/:id", brandController_1.getBrandById);
/**
 * @openapi
 * /api/brands/search/{title}:
 *   get:
 *     tags: [Brands]
 *     summary: Rechercher des brands par titre
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultats de recherche
 */
router.get("/brands/search/:title", brandController_1.searchBrands);
/**
 * @openapi
 * /api/brands/refresh:
 *   post:
 *     tags: [Brands]
 *     summary: Rafraichir les brands depuis l'API
 *     responses:
 *       200:
 *         description: Cache brands mis a jour
 */
router.post("/brands/refresh", brandController_1.refreshBrands);
/**
 * @openapi
 * /api/brands/stats/count:
 *   get:
 *     tags: [Brands]
 *     summary: Nombre de brands en cache
 *     responses:
 *       200:
 *         description: Compteur des brands
 */
router.get("/brands/stats/count", brandController_1.getBrandsCount);
/**
 * @openapi
 * /api/brands/cache:
 *   delete:
 *     tags: [Brands]
 *     summary: Vider le cache brands
 *     responses:
 *       200:
 *         description: Cache vide
 */
router.delete("/brands/cache", brandController_1.clearBrandsCache);
// Shows endpoints (montées sous /api/shows)
router.use("/shows", showRoutes_1.default);
router.use("/diffusions", diffusionRoutes_1.default);
exports.default = router;
//# sourceMappingURL=apiRoutes.js.map