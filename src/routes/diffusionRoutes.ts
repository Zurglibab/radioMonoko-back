import { Router } from "express";
import { getDiffusionsByStation, getDiffusionsOfShowByUrl } from "../controllers/diffusionController";

const router = Router();

/**
 * @openapi
 * /api/diffusions/show-by-url:
 *   get:
 *     tags: [Diffusions]
 *     summary: Recuperer les diffusions d'un show par son URL
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: first
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste des diffusions du show
 */
router.get("/show-by-url", getDiffusionsOfShowByUrl);

/**
 * @openapi
 * /api/diffusions/{station}:
 *   get:
 *     tags: [Diffusions]
 *     summary: Recuperer les diffusions d'une station
 *     parameters:
 *       - in: path
 *         name: station
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: themes
 *         required: false
 *         schema:
 *           type: string
 *         description: Liste des themes separes par des virgules
 *       - in: query
 *         name: first
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Liste des diffusions
 */
router.get("/:station", getDiffusionsByStation);

export default router;