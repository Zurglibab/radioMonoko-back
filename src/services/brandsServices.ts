import { BrandsRepository } from "../repository/brandsRepository";
import { BrandDAO } from "../DAO/brandDAO";
import { BrandDto } from "../DTO/brandDTO";

export class BrandApiService {
  private readonly apiRepository: BrandsRepository;
  private readonly redisDao: BrandDAO;

  constructor() {
    this.apiRepository = new BrandsRepository();
    this.redisDao = new BrandDAO();
  }




  async refreshBrandsFromApiToRedis(): Promise<BrandDto[]> {
    try {
      console.log("[BrandApiService] Fetching brands from API...");
      const brands = await this.apiRepository.getBrands();

      console.log(`[BrandApiService] Got ${brands.length} brands, storing in Redis...`);
      await this.redisDao.saveAll(brands);

      console.log("[BrandApiService] Brands successfully stored in Redis");
      return brands;
    } catch (error) {
      console.error("[BrandApiService] Failed to refresh brands:", error);
      throw error;
    }
  }




  async getBrandsFromRedis(): Promise<BrandDto[] | null> {
    try {
      console.log("[BrandApiService] Fetching brands from Redis...");
      const brands = await this.redisDao.getAll();

      if (!brands) {
        console.log("[BrandApiService] No brands found in Redis");
        return null;
      }

      console.log(`[BrandApiService] Retrieved ${brands.length} brands from Redis`);
      return brands;
    } catch (error) {
      console.error("[BrandApiService] Failed to get brands from Redis:", error);
      throw error;
    }
  }




  async getBrandsWithFallback(): Promise<BrandDto[]> {
    try {

      const cachedBrands = await this.getBrandsFromRedis();
      if (cachedBrands && cachedBrands.length > 0) {
        return cachedBrands;
      }


      console.log("[BrandApiService] Cache miss, fetching from API...");
      return await this.refreshBrandsFromApiToRedis();
    } catch (error) {
      console.error("[BrandApiService] Failed with fallback:", error);
      throw error;
    }
  }




  async deleteBrandsFromRedis(): Promise<void> {
    try {
      console.log("[BrandApiService] Deleting brands from Redis...");
      await this.redisDao.deleteAll();
      console.log("[BrandApiService] Brands successfully deleted from Redis");
    } catch (error) {
      console.error("[BrandApiService] Failed to delete brands:", error);
      throw error;
    }
  }
}


export const brandApiService = new BrandApiService();