import { Router } from "express";
import {
    getShowsByStation,
    getShowById,
    searchShowsByTitle,
    refreshShows,
    getShowsCount,
    clearShowsCache
} from "../controllers/showController";

const router = Router();


router.get("/:station", getShowsByStation);
router.get("/:station/:id", getShowById);
router.get("/:station/search/:title", searchShowsByTitle);
router.post("/:station/refresh", refreshShows);

router.get("/:station/stats/count", getShowsCount);

router.delete("/:station/cache", clearShowsCache);

export default router;

