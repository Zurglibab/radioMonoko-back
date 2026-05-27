import { Router } from "express";
import {
  getShowsByStation,
  getShowById,
  searchShowsByTitle,
  refreshShows,
  getShowsCount,
  clearShowsCache } from
"../controllers/showController";

const router = Router();








router.get("/:station/search/:title", searchShowsByTitle);








router.get("/:station/stats/count", getShowsCount);








router.post("/:station/refresh", refreshShows);








router.delete("/:station/cache", clearShowsCache);








router.get("/:station/:id", getShowById);








router.get("/:station", getShowsByStation);

export default router;