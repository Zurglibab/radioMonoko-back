import { Router } from "express";
import {
    getAllBrands,
    getBrandById,
    searchBrands,
    refreshBrands,
    getBrandsCount,
    clearBrandsCache,
    health
} from "../controllers/brandController";
import showRoutes from "./showRoutes";
import diffusionRoutes from "./diffusionRoutes";
import liveRoutes from "./liveRoutes";
// Notifications moved out of /api (they are not RadioFrance-related)

const router = Router();

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
router.get("/health", health);

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
router.get("/brands", getAllBrands);

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
router.get("/brands/:id", getBrandById);

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
router.get("/brands/search/:title", searchBrands);

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
router.post("/brands/refresh", refreshBrands);

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
router.get("/brands/stats/count", getBrandsCount);

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
router.delete("/brands/cache", clearBrandsCache);

// Shows endpoints (montées sous /api/shows)
router.use("/shows", showRoutes);
router.use("/diffusions", diffusionRoutes);
router.use("/live", liveRoutes);
// notifications no longer mounted here

export default router;
