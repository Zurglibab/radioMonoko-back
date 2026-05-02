import { ContentType } from '../interfaces/contentInterface';

export interface CreateContentDTO {
    id: string;
    api_id: string;
    title: string;
    description?: string;
    content_type: ContentType;
}

export interface UpdateContentDTO {
    title?: string;
    description?: string;
    content_type?: ContentType;
}
