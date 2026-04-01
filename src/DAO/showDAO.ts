import { connect, getClient } from "../config/RedisConnexion";
import { ShowDto } from "../DTO/showDTO";
import { StationsEnum } from "../enums/stationsEnum";

const client = getClient();

export class ShowDAO {
    private getShowsKey(station: StationsEnum): string {
        return `shows:${station}`;
    }

    private getShowIdKey(station: StationsEnum, showId: string): string {
        return `show:${station}:${showId}`;
    }

    private getShowIdsKey(station: StationsEnum): string {
        return `show:ids:${station}`;
    }

    private async ensureConnected() {
        await connect();
    }

    /**
     * Sauvegarde tous les shows pour une station dans Redis
     */
    async saveAllByStation(station: StationsEnum, shows: ShowDto[]): Promise<void> {
        try {
            await this.ensureConnected();

            const showsKey = this.getShowsKey(station);
            const idsKey = this.getShowIdsKey(station);

            // Sauvegarde du JSON complet
            await client.set(showsKey, JSON.stringify(shows));

            // Sauvegarde des IDs dans un set
            await client.del(idsKey);
            const ids = shows.map((s) => s.id);
            if (ids.length > 0) {
                await client.sAdd(idsKey, ids);
            }

            // Sauvegarde de chaque show comme hash
            for (const show of shows) {
                const key = this.getShowIdKey(station, show.id);
                const hashPayload: Record<string, string> = {
                    id: show.id,
                    title: show.title || "",
                    diffusions: JSON.stringify(show.diffusions || []),
                    taxonomies: JSON.stringify(show.taxonomies || [])
                };

                await client.hSet(key, hashPayload);
            }

            console.log(`[RedisShowDao] Saved ${shows.length} shows for station ${station}`);
        } catch (error) {
            console.error("[ShowDAO] Failed to save shows:", error);
            throw error;
        }
    }

    /**
     * Récupère tous les shows pour une station depuis Redis
     */
    async getAllByStation(station: StationsEnum): Promise<ShowDto[] | null> {
        try {
            await this.ensureConnected();

            const showsKey = this.getShowsKey(station);
            const jsonData = await client.get(showsKey);

            if (!jsonData || typeof jsonData !== "string") {
                console.log(`[RedisShowDao] No shows found for station ${station}`);
                return null;
            }

            const shows: ShowDto[] = JSON.parse(jsonData);
            console.log(`[RedisShowDao] Retrieved ${shows.length} shows for station ${station}`);
            return shows;
        } catch (error) {
            console.error("[ShowDAO] Failed to get shows:", error);
            throw error;
        }
    }

    /**
     * Récupère un show spécifique par son ID
     */
    async getByIdAndStation(station: StationsEnum, id: string): Promise<ShowDto | null> {
        try {
            await this.ensureConnected();

            const key = this.getShowIdKey(station, id);
            const hashData = await client.hGetAll(key);

            if (!hashData || Object.keys(hashData).length === 0) {
                console.log(`[RedisShowDao] No show found with id ${id} for station ${station}`);
                return null;
            }

            const show: ShowDto = {
                id: hashData.id || id,
                title: hashData.title || "",
                diffusions: hashData.diffusions ? JSON.parse(hashData.diffusions) : [],
                taxonomies: hashData.taxonomies ? JSON.parse(hashData.taxonomies) : []
            };

            return show;
        } catch (error) {
            console.error("[ShowDAO] Failed to get show by id:", error);
            throw error;
        }
    }

    /**
     * Récupère tous les IDs des shows pour une station
     */
    async getAllIdsByStation(station: StationsEnum): Promise<string[]> {
        try {
            await this.ensureConnected();

            const idsKey = this.getShowIdsKey(station);
            const ids = await client.sMembers(idsKey);
            console.log(`[RedisShowDao] Retrieved ${ids.length} show IDs for station ${station}`);
            return ids;
        } catch (error) {
            console.error("[ShowDAO] Failed to get show IDs:", error);
            throw error;
        }
    }

    /**
     * Supprime un show spécifique
     */
    async deleteByIdAndStation(station: StationsEnum, id: string): Promise<void> {
        try {
            await this.ensureConnected();

            const key = this.getShowIdKey(station, id);
            const idsKey = this.getShowIdsKey(station);

            await client.del(key);
            await client.sRem(idsKey, id);

            console.log(`[RedisShowDao] Deleted show with id ${id} for station ${station}`);
        } catch (error) {
            console.error("[ShowDAO] Failed to delete show:", error);
            throw error;
        }
    }

    /**
     * Supprime tous les shows pour une station
     */
    async deleteAllByStation(station: StationsEnum): Promise<void> {
        try {
            await this.ensureConnected();

            const showsKey = this.getShowsKey(station);
            const idsKey = this.getShowIdsKey(station);
            const ids = await client.sMembers(idsKey);

            await client.del(showsKey);
            await client.del(idsKey);

            for (const id of ids) {
                await client.del(this.getShowIdKey(station, id));
            }

            console.log(`[RedisShowDao] Deleted all shows for station ${station}`);
        } catch (error) {
            console.error("[ShowDAO] Failed to delete all shows:", error);
            throw error;
        }
    }

    /**
     * Vérifie si un show existe
     */
    async existsByIdAndStation(station: StationsEnum, id: string): Promise<boolean> {
        try {
            await this.ensureConnected();

            const idsKey = this.getShowIdsKey(station);
            const exists = await client.sIsMember(idsKey, id);
            return exists === 1;
        } catch (error) {
            console.error("[ShowDAO] Failed to check if show exists:", error);
            throw error;
        }
    }

    /**
     * Récupère le nombre total de shows pour une station
     */
    async countByStation(station: StationsEnum): Promise<number> {
        try {
            await this.ensureConnected();

            const idsKey = this.getShowIdsKey(station);
            const count = await client.sCard(idsKey);
            return count;
        } catch (error) {
            console.error("[ShowDAO] Failed to count shows:", error);
            throw error;
        }
    }
}

// Export singleton
export const redisShowDao = new ShowDAO();

