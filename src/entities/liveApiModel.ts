export interface LiveApiPodcastEpisode {
    id?: string;
    title?: string;
    url?: string;
    playerUrl?: string;
    created?: string;
    duration?: number;
}

export interface LiveApiDiffusion {
    id?: string;
    title?: string;
    standFirst?: string;
    url?: string;
    published_date?: string;
    podcastEpisode?: LiveApiPodcastEpisode;
}

export interface LiveApiStep {
    __typename?: "DiffusionStep" | "BlankStep" | string;
    id?: string;
    title?: string;
    diffusion?: LiveApiDiffusion;
}

export interface LiveApiTrack {
    id?: string;
    title?: string;
    albumTitle?: string;
    discNumber?: number;
    trackNumber?: number;
}

export interface LiveApiSong {
    id?: string;
    start?: string;
    end?: string;
    track?: LiveApiTrack;
}

export interface LiveApiModel {
    show?: LiveApiStep;
    program?: LiveApiStep;
    song?: LiveApiSong;
}

export interface LiveQueryResponse {
    live?: LiveApiModel;
}

