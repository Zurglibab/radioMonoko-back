import { Router } from "express";
import { getLiveByStation } from "../controllers/liveController";

const router = Router();

/**
 * @openapi
 * /api/live/{station}:
 *   get:
 *     tags: [Live]
 *     summary: Recuperer le live d'une station
 *     parameters:
 *       - in: path
 *         name: station
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Live de la station
 */
router.get("/:station", getLiveByStation);

export default router;