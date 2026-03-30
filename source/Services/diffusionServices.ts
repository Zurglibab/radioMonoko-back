import { StationsEnum } from "../Enums/stationsEnum";
import { DiffusionDto } from "../DTO/diffusionDTO";
import { diffusionRepository } from "../Repository/diffusionRepository";

export class DiffusionApiService {
    async getDiffusions(
        station: StationsEnum,
        themes?: string[],
        first: number = 20
    ): Promise<DiffusionDto[]> {
        return diffusionRepository.fetchDiffusionsByStation(station, themes, first);
    }
}

export const diffusionApiService = new DiffusionApiService();

