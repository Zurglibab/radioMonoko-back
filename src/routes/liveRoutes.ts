import { Router } from "express";
import { getLiveByStation } from "../controllers/liveController";

const router = Router();

















router.get("/:station", getLiveByStation);

export default router;