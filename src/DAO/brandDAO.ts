import { connect } from "../config/RedisConnexion";
import client from "../config/RedisConnexion";

import { BrandDto } from "../DTO/brandDTO";

export class BrandDAO {
  private readonly allBrandsKey = "brands:all";
  private readonly brandIdsKey = "brands:ids";

  private async ensureConnected() {
    await connect();
  }




  async saveAll(brands: BrandDto[]): Promise<void> {
    try {
      await this.ensureConnected();


      await client.set(this.allBrandsKey, JSON.stringify(brands));


      await client.del(this.brandIdsKey);
      const ids = brands.map((b) => b.id);
      if (ids.length > 0) {
        await client.sAdd(this.brandIdsKey, ids);
      }


      for (const brand of brands) {
        const key = `brand:${brand.id}`;
        const hashPayload: Record<string, string> = {
          id: brand.id,
          title: brand.title || "",
          baseline: brand.baseline || "",
          description: brand.description || "",
          websiteUrl: brand.websiteUrl || "",
          liveStream: brand.liveStream || "",
          playerUrl: brand.playerUrl || ""
        };

        await client.hSet(key, hashPayload);


        if (brand.webRadios && brand.webRadios.length > 0) {
          await client.hSet(key, {
            webRadios: JSON.stringify(brand.webRadios)
          });
        }
        if (brand.localRadios && brand.localRadios.length > 0) {
          await client.hSet(key, {
            localRadios: JSON.stringify(brand.localRadios)
          });
        }
      }

      console.log(`[RedisDao] Saved ${brands.length} brands to Redis`);
    } catch (error) {
      console.error("[BrandDAO] Failed to save brands:", error);
      throw error;
    }
  }




  async getAll(): Promise<BrandDto[] | null> {
    try {
      await this.ensureConnected();

      const jsonData = await client.get(this.allBrandsKey);

      if (!jsonData || typeof jsonData !== "string") {
        console.log("[BrandDAO] No brands found in Redis");
        return null;
      }

      const brands: BrandDto[] = JSON.parse(jsonData);
      console.log(`[RedisDao] Retrieved ${brands.length} brands from Redis`);
      return brands;
    } catch (error) {
      console.error("[BrandDAO] Failed to get brands:", error);
      throw error;
    }
  }




  async getById(id: string): Promise<BrandDto | null> {
    try {
      await this.ensureConnected();

      const key = `brand:${id}`;
      const hashData = await client.hGetAll(key);

      if (!hashData || Object.keys(hashData).length === 0) {
        console.log(`[RedisDao] No brand found with id ${id}`);
        return null;
      }

      const brand: BrandDto = {
        id: hashData.id || id,
        title: hashData.title || "",
        baseline: hashData.baseline,
        description: hashData.description,
        websiteUrl: hashData.websiteUrl,
        liveStream: hashData.liveStream,
        playerUrl: hashData.playerUrl,
        webRadios: hashData.webRadios ? JSON.parse(hashData.webRadios) : [],
        localRadios: hashData.localRadios ? JSON.parse(hashData.localRadios) : []
      };

      return brand;
    } catch (error) {
      console.error(`[RedisDao] Failed to get brand by id ${id}:`, error);
      throw error;
    }
  }




  async getAllIds(): Promise<string[]> {
    try {
      await this.ensureConnected();

      const ids = await client.sMembers(this.brandIdsKey);
      console.log(`[RedisDao] Retrieved ${ids.length} brand IDs from Redis`);
      return ids;
    } catch (error) {
      console.error("[BrandDAO] Failed to get brand IDs:", error);
      throw error;
    }
  }




  async deleteById(id: string): Promise<void> {
    try {
      await this.ensureConnected();

      const key = `brand:${id}`;
      await client.del(key);
      await client.sRem(this.brandIdsKey, id);

      console.log(`[RedisDao] Deleted brand with id ${id}`);
    } catch (error) {
      console.error(`[RedisDao] Failed to delete brand with id ${id}:`, error);
      throw error;
    }
  }




  async deleteAll(): Promise<void> {
    try {
      await this.ensureConnected();

      const ids = await client.sMembers(this.brandIdsKey);

      await client.del(this.allBrandsKey);
      await client.del(this.brandIdsKey);

      for (const id of ids) {
        await client.del(`brand:${id}`);
      }

      console.log("[BrandDAO] Deleted all brands from Redis");
    } catch (error) {
      console.error("[BrandDAO] Failed to delete all brands:", error);
      throw error;
    }
  }




  async exists(id: string): Promise<boolean> {
    try {
      await this.ensureConnected();

      const exists = await client.sIsMember(this.brandIdsKey, id);
      return exists === 1;
    } catch (error) {
      console.error(`[RedisDao] Failed to check if brand exists:`, error);
      throw error;
    }
  }




  async count(): Promise<number> {
    try {
      await this.ensureConnected();

      const count = await client.sCard(this.brandIdsKey);
      return count;
    } catch (error) {
      console.error("[BrandDAO] Failed to count brands:", error);
      throw error;
    }
  }
}


export const redisDao = new BrandDAO();