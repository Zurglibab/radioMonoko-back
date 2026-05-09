import * as cron from "node-cron";
import { brandApiService } from "../services/brandsServices";

/**
 * startBrandsScheduler now supports two modes:
 * - interval mode when BRANDS_REFRESH_INTERVAL_HOURS is set (runs immediately then every N hours)
 * - cron mode (default) using BRANDS_REFRESH_CRON and BRANDS_REFRESH_TZ
 */
export function startBrandsScheduler() {
    const intervalHoursEnv = process.env.BRANDS_REFRESH_INTERVAL_HOURS;
    const intervalHours = intervalHoursEnv ? Number(intervalHoursEnv) : NaN;

    // If an integer > 0 is provided, use interval mode (every N hours from start)
    if (!isNaN(intervalHours) && intervalHours > 0) {
        console.log(`[brandsScheduler] Starting interval scheduler - every ${intervalHours} hour(s)`);

        let intervalId: NodeJS.Timeout | null = null;

        const run = async () => {
            try {
                console.log("[brandsScheduler] Refreshing brands (interval)...");
                await brandApiService.refreshBrandsFromApiToRedis();
                console.log("[brandsScheduler] Refresh completed.");
            } catch (err) {
                console.error("[brandsScheduler] Refresh failed:", err);
            }
        };

        // Run immediately, then schedule every intervalHours
        run();
        intervalId = setInterval(run, intervalHours * 60 * 60 * 1000);

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
                console.log("[brandsScheduler] Interval scheduler stopped.");
            }
        };
    }

    // Fallback to cron mode (default behavior)
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

