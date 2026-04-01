export interface DiffusionApiTaxonomyNode {
    id?: string;
    path?: string;
    title?: string;
}

export interface DiffusionApiNode {
    id?: string;
    title?: string;
    standFirst?: string;
    url?: string;
    published_date?: string;
    taxonomiesConnection?: {
        edges?: Array<{
            node?: DiffusionApiTaxonomyNode;
        }>;
    };
}

export interface DiffusionsQueryResponse {
    diffusions?: {
        edges?: Array<{
            node?: DiffusionApiNode;
        }>;
    };
}
