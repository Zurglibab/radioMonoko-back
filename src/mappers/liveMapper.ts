import {
  LiveDiffusionDto,
  LiveDto,
  LiveSongDto,
  LiveStepDto,
  PodcastEpisodeDto } from
"../DTO/liveDTO";
import {
  LiveApiDiffusion,
  LiveApiModel,
  LiveApiPodcastEpisode,
  LiveApiSong,
  LiveApiStep } from
"../entities/liveApiModel";

const toPodcastEpisodeDto = (raw: LiveApiPodcastEpisode): PodcastEpisodeDto => ({
  id: raw?.id ?? "",
  title: raw?.title ?? "",
  url: raw?.url ?? undefined,
  playerUrl: raw?.playerUrl ?? undefined,
  created: raw?.created ?? undefined,
  duration: raw?.duration ?? undefined
});

const toLiveDiffusionDto = (raw: LiveApiDiffusion): LiveDiffusionDto => ({
  id: raw?.id ?? "",
  title: raw?.title ?? "",
  standFirst: raw?.standFirst ?? undefined,
  url: raw?.url ?? undefined,
  publishedDate: raw?.published_date ?? undefined,
  podcastEpisode: raw?.podcastEpisode ? toPodcastEpisodeDto(raw.podcastEpisode) : undefined
});

const toLiveStepDto = (raw?: LiveApiStep): LiveStepDto | undefined => {
  if (!raw) {
    return undefined;
  }

  if (raw.__typename === "DiffusionStep") {
    return {
      id: raw?.id ?? "",
      type: "DiffusionStep",
      diffusion: raw?.diffusion ? toLiveDiffusionDto(raw.diffusion) : undefined
    };
  }

  return {
    id: raw?.id ?? "",
    type: "BlankStep",
    title: raw?.title ?? undefined
  };
};

const toLiveSongDto = (raw?: LiveApiSong): LiveSongDto | undefined => {
  if (!raw) {
    return undefined;
  }

  return {
    id: raw?.id ?? "",
    start: raw?.start ?? undefined,
    end: raw?.end ?? undefined,
    track: raw?.track ?
    {
      id: raw.track?.id ?? "",
      title: raw.track?.title ?? "",
      albumTitle: raw.track?.albumTitle ?? undefined,
      discNumber: raw.track?.discNumber ?? undefined,
      trackNumber: raw.track?.trackNumber ?? undefined
    } :
    undefined
  };
};

export const toLiveDto = (raw?: LiveApiModel | null): LiveDto => ({
  show: toLiveStepDto(raw?.show),
  program: toLiveStepDto(raw?.program),
  song: toLiveSongDto(raw?.song)
});