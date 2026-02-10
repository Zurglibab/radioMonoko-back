export interface brands{
    id : string,
    title : string,
    baseline : string,
    description : string,
    websiteUrl : string,
    playerUrl : string,
    liveStream : string,
    localRadios : LocalRadio[],
    webRadios : WebRadio[]
}
export interface WebRadio{
    id : string
    title : string,
    description : string,
    liveStream : string,
    playerUrl : string
}
export interface LocalRadio{
    id : string
    title : string,
    description : string,
    liveStream : string,
    playerUrl : string
}
export interface ApiResponse{
    brands : brands[]
}
