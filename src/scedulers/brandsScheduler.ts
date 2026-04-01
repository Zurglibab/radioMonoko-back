import * as cron from "node-cron";
import { brandApiService } from "../services/brandsServices";

export function startBrandsScheduler() {
    const cronExpression = process.env.BRANDS_REFRESH_CRON || "0 0,12 * * *";
    const timezone = process.env.BRANDS_REFRESH_TZ || "Europe/Paris";

    const task = cron.schedule(
        cronExpression,
        async () => {
            try {
                console.log("[brandsScheduler] Refreshing brands...");
                await brandApiService.refreshBrandsFromApiToRedis();
                console.log("[brandsScheduler] Refresh completed.");
            } catch (err) {
                console.error("[brandsScheduler] Refresh failed:", err);
            }
        },
        { timezone }
    );

    console.log(
        `[brandsScheduler] Scheduler started - cron: "${cronExpression}" timezone: "${timezone}"`
    );

    return () => {
        task.stop();
        console.log("[brandsScheduler] Scheduler stopped.");
    };
}

