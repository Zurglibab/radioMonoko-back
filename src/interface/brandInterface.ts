export interface WebRadio {
    id: string;
    title: string;
    description?: string;
    liveStream?: string;
    playerUrl?: string;
}

export interface LocalRadio {
    id: string;
    title: string;
    description?: string;
    liveStream?: string;
    playerUrl?: string;
}

export interface Brand {
    id: string;
    title: string;
    baseline?: string;
    description?: string;
    websiteUrl?: string;
    liveStream?: string;
    playerUrl?: string;
    webRadios?: WebRadio[];
    localRadios?: LocalRadio[];
}

export interface allBrands {
    brands: Brand[];
}
