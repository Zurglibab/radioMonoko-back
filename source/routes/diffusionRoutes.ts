import { Router } from "express";
import { getDiffusionsByStation } from "../controllers/diffusionController";

const router = Router();

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
