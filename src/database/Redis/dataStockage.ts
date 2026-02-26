import client, { connect } from "../../config/RedisConnexion";
import {allBrands, Brand} from "../../interface/brandInterface";

export async function setData(data: allBrands) {
    try {
        await ensureConnected();
        const jsonData = JSON.stringify(data);
        await client.set("brandsData", jsonData);
        console.log("Données stockées dans Redis avec succès.");
    } catch (err) {
        console.error('Erreur lors du stockage général des brands dans Redis:', err);
        throw err;
    }
}

export async function storeBrandsInRedis(brands: Brand[]) {
    try {
        await ensureConnected();
        // Stocker le JSON complet
        await client.set("brands:all", JSON.stringify(brands));

        // Stocker les ids dans un set
        const ids = brands.map(b => b.id);
        if (ids.length > 0) {
            // remplacer le set existant
            await client.del("brands:ids");
            await client.sAdd("brands:ids", ids);
        }

        // Pour chaque brand, stocker un hash avec des champs
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
            // hSet accepte un objet
            await client.hSet(key, hashPayload);

            // Optionnel: stocker webRadios/localRadios en JSON sous des champs
            if (brand.webRadios) {
                await client.hSet(key, { webRadios: JSON.stringify(brand.webRadios) });
            }
            if (brand.localRadios) {
                await client.hSet(key, { localRadios: JSON.stringify(brand.localRadios) });
            }
        }
        // console.log(`Stored ${brands.length} brands to Redis`);
    } catch (err) {
        console.error('Erreur lors du stockage des brands dans Redis:', err);
        throw err;
    }
}

export async function getBrandsFromRedis(): Promise<Brand[] | null> {
    try {
        await ensureConnected();
        const jsonData = await client.get("brands:all");
        if (jsonData) {
            if (typeof jsonData === "string") {
                const brands: Brand[] = JSON.parse(jsonData);
                return brands;
            }
        } else {
            console.log("Aucune donnée de brands trouvée dans Redis.");
            return null;
        }
    } catch (err) {
        console.error('Erreur lors de la récupération des brands depuis Redis:', err);
    }
}

export async function deleteBrandsFromRedis() {
    try {
        await ensureConnected();
        await client.del("brands:all");
        await client.del("brands:ids");
        // Optionnel: supprimer les hashes individuels
        const ids = await client.sMembers("brands:ids");
        for (const id of ids) {
            await client.del(`brand:${id}`);
        }
        console.log("Données de brands supprimées de Redis.");
    } catch (err) {
        console.error('Erreur lors de la suppression des brands de Redis:', err);
    }
}



async function ensureConnected() {
    try {
        await connect();
    } catch (err) {
        console.error('Impossible de se connecter à Redis avant opération:', err);
        throw err;
    }
}
