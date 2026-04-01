import { ShowRepository } from "../repository/showRepository";
import { ShowDAO } from "../DAO/showDAO";
import { ShowDto } from "../DTO/showDTO";
import { StationsEnum } from "../enums/stationsEnum";

export class ShowApiService {
    private readonly apiRepository: ShowRepository;
    private readonly redisDao: ShowDAO;

    constructor() {
        this.apiRepository = new ShowRepository();
        this.redisDao = new ShowDAO();
    }

    /**
     * Récupère les shows depuis l'API et les stocke dans Redis
     */
    async refreshShowsFromApiToRedis(
        station: StationsEnum,
        first: number = 10
    ): Promise<ShowDto[]> {
        try {
            console.log(
                `[ShowApiService] Fetching shows from API for station ${station}...`
            );
            const shows = await this.apiRepository.fetchShowsByStation(station, first);

            console.log(
                `[ShowApiService] Got ${shows.length} shows, storing in Redis...`
            );
            await this.redisDao.saveAllByStation(station, shows);

            console.log("[ShowApiService] Shows successfully stored in Redis");
            return shows;
        } catch (error) {
            console.error("[ShowApiService] Failed to refresh shows:", error);
            throw error;
        }
    }

    /**
     * Récupère les shows depuis Redis
     */
    async getShowsFromRedis(station: StationsEnum): Promise<ShowDto[] | null> {
        try {
            console.log(`[ShowApiService] Fetching shows from Redis for station ${station}...`);
            const shows = await this.redisDao.getAllByStation(station);

            if (!shows) {
                console.log(`[ShowApiService] No shows found in Redis for station ${station}`);
                return null;
            }

            console.log(
                `[ShowApiService] Retrieved ${shows.length} shows from Redis for station ${station}`
            );
            return shows;
        } catch (error) {
            console.error("[ShowApiService] Failed to get shows from Redis:", error);
            throw error;
        }
    }

    /**
     * Récupère les shows depuis Redis, sinon les récupère depuis l'API
     */
    async getShowsWithFallback(
        station: StationsEnum,
        first: number = 10
    ): Promise<ShowDto[]> {
        try {
            const cachedShows = await this.getShowsFromRedis(station);
            if (cachedShows && cachedShows.length > 0) {
                return cachedShows;
            }
            console.log(`[ShowApiService] Cache miss, fetching from API...`);
            return await this.refreshShowsFromApiToRedis(station, first);
        } catch (error) {
            console.error("[ShowApiService] Failed with fallback:", error);
            throw error;
        }
    }

    /**
     * Supprime les shows de Redis pour une station
     */
    async deleteShowsFromRedis(station: StationsEnum): Promise<void> {
        try {
            console.log(`[ShowApiService] Deleting shows from Redis for station ${station}...`);
            await this.redisDao.deleteAllByStation(station);
            console.log("[ShowApiService] Shows successfully deleted from Redis");
        } catch (error) {
            console.error("[ShowApiService] Failed to delete shows:", error);
            throw error;
        }
    }
}

export const showApiService = new ShowApiService();

