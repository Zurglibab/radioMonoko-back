import { Request, Response } from "express";
import { brandApiService } from "../services/brandsServices";
import { redisDao } from "../DAO/brandDAO";





export async function getAllBrands(req: Request, res: Response) {
  try {
    console.log("[apiController] GET /api/brands");
    const brands = await brandApiService.getBrandsWithFallback();

    res.status(200).json({
      success: true,
      data: brands,
      count: brands.length
    });
  } catch (error) {
    console.error("[apiController] getAllBrands failed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch brands"
    });
  }
}





export async function getBrandById(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    console.log(`[apiController] GET /api/brands/${id}`);

    const brand = await redisDao.getById(id);

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
  } catch (error) {
    console.error("[apiController] getBrandById failed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch brand"
    });
  }
}





export async function searchBrands(req: Request, res: Response) {
  try {
    const title = Array.isArray(req.params.title) ? req.params.title[0] : req.params.title;
    console.log(`[apiController] GET /api/brands/search/${title}`);

    const allBrands = await brandApiService.getBrandsWithFallback();
    const filtered = allBrands.filter((brand) =>
    brand.title.toLowerCase().includes(title.toLowerCase())
    );

    res.status(200).json({
      success: true,
      data: filtered,
      count: filtered.length,
      query: title
    });
  } catch (error) {
    console.error("[apiController] searchBrands failed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Search failed"
    });
  }
}





export async function refreshBrands(req: Request, res: Response) {
  try {
    console.log("[apiController] POST /api/brands/refresh");

    const brands = await brandApiService.refreshBrandsFromApiToRedis();

    res.status(200).json({
      success: true,
      message: `Successfully refreshed ${brands.length} brands`,
      data: brands,
      count: brands.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("[apiController] refreshBrands failed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Refresh failed"
    });
  }
}





export async function getBrandsCount(req: Request, res: Response) {
  try {
    console.log("[apiController] GET /api/brands/stats/count");

    const count = await redisDao.count();

    res.status(200).json({
      success: true,
      data: {
        total: count,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("[apiController] getBrandsCount failed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to count brands"
    });
  }
}





export async function clearBrandsCache(req: Request, res: Response) {
  try {
    console.log("[apiController] DELETE /api/brands/cache");

    await brandApiService.deleteBrandsFromRedis();

    res.status(200).json({
      success: true,
      message: "Brands cache cleared successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("[apiController] clearBrandsCache failed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to clear cache"
    });
  }
}





export async function health(req: Request, res: Response) {
  try {
    const count = await redisDao.count();

    res.status(200).json({
      success: true,
      status: "healthy",
      redis: {
        connected: true,
        brands_cached: count
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Redis connection failed"
    });
  }
}