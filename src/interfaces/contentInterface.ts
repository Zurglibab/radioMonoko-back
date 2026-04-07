export type ContentType = 'show' | 'diffusion' | 'live' | 'podcast' | 'article' | 'other';

export interface Content {
    id: string;
    api_id: string;
    title: string;
    description?: string;
    content_type: ContentType;
    created_at: Date;
}

