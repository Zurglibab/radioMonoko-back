import { StationsEnum } from "../enums/stationsEnum";
import { LiveDto } from "../DTO/liveDTO";
import { liveRepository } from "../repository/liveRepository";

export class LiveApiService {
  async getLive(station: StationsEnum): Promise<LiveDto> {
    return liveRepository.fetchLiveByStation(station);
  }
}

export const liveApiService = new LiveApiService();