import { CollectionItem } from './collectionItems.types';
import { CreateCollectionItemDTO, UpdateCollectionItemDTO } from './collectionItems.dto';

export interface CollectionItemsRepository {
    findAll(): Promise<CollectionItem[]>;
    findByCollectionId(collectionId: string): Promise<CollectionItem[]>;
    findByKeys(collectionId: string, contentId: string): Promise<CollectionItem | null>;
    create(item: CreateCollectionItemDTO): Promise<CollectionItem>;
    updateByKeys(collectionId: string, contentId: string, item: UpdateCollectionItemDTO): Promise<CollectionItem | null>;
    deleteByKeys(collectionId: string, contentId: string): Promise<CollectionItem | null>;
}

