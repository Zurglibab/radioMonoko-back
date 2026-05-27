import { Router } from "express";
import { getDiffusionsByStation } from "../controllers/diffusionController";

const router = Router();





























router.get("/:station", getDiffusionsByStation);

export default router;