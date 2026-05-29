import { StationsEnum } from "../enums/stationsEnum";
import { DiffusionDto } from "../DTO/diffusionDTO";
import { diffusionRepository } from "../repository/diffusionRepository";

export class DiffusionApiService {
  async getDiffusions(
  station: StationsEnum,
  themes?: string[],
  first: number = 20)
  : Promise<DiffusionDto[]> {
    return diffusionRepository.fetchDiffusionsByStation(station, themes, first);
  }

  async getDiffusionsOfShowByUrl(url: string, first: number = 10): Promise<DiffusionDto[]> {
    return diffusionRepository.fetchDiffusionsOfShowByUrl(url, first);
  }
}

export const diffusionApiService = new DiffusionApiService();