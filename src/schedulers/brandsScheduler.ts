import { refreshBrandsInRedis } from "../database/Redis/dataManager";
import * as cron from "node-cron";

export function startBrandsScheduler() {
    // Tâche cron pour exécuter à 00h et 12h, fuseau horaire français (Europe/Paris)
    const task = cron.schedule(
        "0 0,12 * * *", // À la minute 0 des heures 0 et 12
        async () => {
            try {
                console.log("[brands-scheduler] Refreshing brands...");
                await refreshBrandsInRedis();
                console.log("[brands-scheduler] Refresh completed.");
            } catch (err) {
                console.error("[brands-scheduler] Refresh failed:", err);
            }
        },
        {
            timezone: "Europe/Paris"
        }
    );

    console.log("[brands-scheduler] Scheduler started - will refresh brands at 00:00 and 12:00 (Europe/Paris)");

    return () => {
        task.stop();
        console.log("[brands-scheduler] Scheduler stopped.");
    };
}

