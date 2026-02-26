import { config } from "dotenv";
import { refreshBrandsInRedis } from "../database/Redis/dataManager";

config();

async function main() {
    try {
        await refreshBrandsInRedis();
        console.log("Brands refresh done.");
        process.exit(0);
    } catch (err) {
        console.error("Brands refresh failed:", err);
        process.exit(1);
    }
}

main();

