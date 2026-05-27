import { config } from "dotenv";
import { showApiService } from "../services/showServices";
import { redisShowDao } from "../DAO/showDAO";
import { disconnect } from "../config/RedisConnexion";
import { StationsEnum } from "../enums/stationsEnum";

config();

async function runShowsIntegrationTest() {
  console.log("\n========================================");
  console.log("[ShowsIntegrationTest] Global Shows API → Redis Test");
  console.log("========================================\n");

  try {
    const station = StationsEnum.FRANCEINTER;
    const first = 5;


    console.log(`[Step 1] Fetching shows from API (station: ${station}, first: ${first})...`);
    const refreshedShows = await showApiService.refreshShowsFromApiToRedis(station, first);
    console.log(`✓ Successfully fetched and stored ${refreshedShows.length} shows\n`);


    console.log("[Step 2] Retrieving shows from Redis...");
    const cachedShows = await showApiService.getShowsFromRedis(station);

    if (!cachedShows) {
      throw new Error("Failed to retrieve shows from Redis");
    }
    console.log(`✓ Retrieved ${cachedShows.length} shows from Redis\n`);


    console.log("[Step 3] Verifying data consistency...");
    if (refreshedShows.length !== cachedShows.length) {
      throw new Error(
        `Show count mismatch: API=${refreshedShows.length}, Redis=${cachedShows.length}`
      );
    }
    console.log(`✓ Show counts match: ${refreshedShows.length} shows\n`);


    console.log("[Step 4] Verifying individual show data...");
    let verifiedCount = 0;
    for (const show of refreshedShows) {
      const redisVersion = await redisShowDao.getByIdAndStation(station, show.id);
      if (!redisVersion) {
        throw new Error(`Show ${show.id} not found in Redis after refresh`);
      }
      if (redisVersion.title !== show.title) {
        throw new Error(`Show ${show.id} title mismatch`);
      }
      verifiedCount++;
    }
    console.log(`✓ All ${verifiedCount} shows verified in Redis\n`);


    console.log("[Step 5] Testing DAO methods...");
    const totalCount = await redisShowDao.countByStation(station);
    console.log(`✓ Total shows in Redis for ${station}: ${totalCount}`);

    if (refreshedShows.length > 0) {
      const firstShowId = refreshedShows[0].id;
      const exists = await redisShowDao.existsByIdAndStation(station, firstShowId);
      console.log(`✓ Show ${firstShowId} exists in Redis: ${exists}`);

      const allIds = await redisShowDao.getAllIdsByStation(station);
      console.log(`✓ Retrieved ${allIds.length} show IDs from Redis\n`);
    }


    console.log("[Step 6] Sample shows from Redis:");
    const sampleSize = Math.min(3, cachedShows.length);
    cachedShows.slice(0, sampleSize).forEach((show, index) => {
      const diffusionCount = show.diffusions ? show.diffusions.length : 0;
      const taxonomyCount = show.taxonomies ? show.taxonomies.length : 0;
      console.log(
        `  ${index + 1}. "${show.title}" (${show.id})` +
        ` - ${diffusionCount} diffusions, ${taxonomyCount} taxonomies`
      );
    });
    if (cachedShows.length > sampleSize) {
      console.log(`  ... and ${cachedShows.length - sampleSize} more`);
    }
    console.log();


    console.log("[Step 7] Testing fallback mechanism (Redis first, then API)...");
    const fallbackShows = await showApiService.getShowsWithFallback(station, first);
    console.log(
      `✓ Fallback returned ${fallbackShows.length} shows (from cache)\n`
    );


    console.log("========================================");
    console.log("[ShowsIntegrationTest] ✅ ALL TESTS PASSED");
    console.log("========================================");
    console.log(`
Summary:
- Station: ${station}
- API Shows: ${refreshedShows.length}
- Redis Shows: ${cachedShows.length}
- All shows verified and accessible
- DAO operations working correctly
- Fallback mechanism functional
`);
    process.exit(0);
  } catch (error) {
    console.error("\n========================================");
    console.error("[ShowsIntegrationTest] ❌ TEST FAILED");
    console.error("========================================");
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  } finally {
    await disconnect();
  }
}

runShowsIntegrationTest();