import { config } from "dotenv";
import { BrandsRepository } from "../Repository/brandsRepository";

config();

async function printAllBrandsWithRepository() {
    try {
        const repository = new BrandsRepository();
        const brands = await repository.getBrands();

        console.log(`\n[apiRepositoryPrintBrands] Total brands: ${brands.length}\n`);

        brands.forEach((brand, index) => {
            console.log(
                `${index + 1}. ${brand.title} (id: ${brand.id})` +
                `${brand.baseline ? ` - baseline: ${brand.baseline}` : ""}`
            );
        });

        console.log("\n[apiRepositoryPrintBrands] Done.");
        process.exit(0);
    } catch (error) {
        console.error("[apiRepositoryPrintBrands] Failed:", error);
        process.exit(1);
    }
}

printAllBrandsWithRepository();