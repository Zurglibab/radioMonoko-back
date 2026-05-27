export interface PodcastEpisodeDto {
  id: string;
  title: string;
  url?: string;
  playerUrl?: string;
  created?: string;
  duration?: number;
}

export interface LiveDiffusionDto {
  id: string;
  title: string;
  standFirst?: string;
  url?: string;
  publishedDate?: string;
  podcastEpisode?: PodcastEpisodeDto;
}

export interface LiveStepDto {
  id: string;
  type: "DiffusionStep" | "BlankStep";
  title?: string;
  diffusion?: LiveDiffusionDto;
}

export interface LiveTrackDto {
  id: string;
  title: string;
  albumTitle?: string;
  discNumber?: number;
  trackNumber?: number;
}

export interface LiveSongDto {
  id: string;
  start?: string;
  end?: string;
  track?: LiveTrackDto;
}

export interface LiveDto {
  show?: LiveStepDto;
  program?: LiveStepDto;
  song?: LiveSongDto;
}

function toPodcastEpisodeDto(raw: any): PodcastEpisodeDto {
  return {
    id: raw?.id ?? "",
    title: raw?.title ?? "",
    url: raw?.url ?? undefined,
    playerUrl: raw?.playerUrl ?? undefined,
    created: raw?.created ?? undefined,
    duration: raw?.duration ?? undefined
  };
}

function toLiveDiffusionDto(raw: any): LiveDiffusionDto {
  return {
    id: raw?.id ?? "",
    title: raw?.title ?? "",
    standFirst: raw?.standFirst ?? undefined,
    url: raw?.url ?? undefined,
    publishedDate: raw?.published_date ?? undefined,
    podcastEpisode: raw?.podcastEpisode ? toPodcastEpisodeDto(raw.podcastEpisode) : undefined
  };
}

export function toLiveStepDto(raw: any): LiveStepDto | undefined {
  if (!raw) {
    return undefined;
  }

  const typename = raw?.__typename;

  if (typename === "DiffusionStep") {
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
}

export function toLiveSongDto(raw: any): LiveSongDto | undefined {
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
}

export function toLiveDto(raw: any): LiveDto {
  return {
    show: toLiveStepDto(raw?.show),
    program: toLiveStepDto(raw?.program),
    song: toLiveSongDto(raw?.song)
  };
}