import { CollectionItem } from '../interfaces/collectionItemsInterface';
import { CreateCollectionItemDTO, UpdateCollectionItemDTO } from '../DTO/collectionItemsDTO';
import { PaginationOptions } from '../utils/pagination';

export interface CollectionItemsRepository {
  findAll(pagination?: PaginationOptions): Promise<CollectionItem[]>;
  findByCollectionId(collectionId: string, pagination?: PaginationOptions): Promise<CollectionItem[]>;
  findByKeys(collectionId: string, contentId: string): Promise<CollectionItem | null>;
  create(item: CreateCollectionItemDTO): Promise<CollectionItem>;
  updateByKeys(collectionId: string, contentId: string, item: UpdateCollectionItemDTO): Promise<CollectionItem | null>;
  deleteByKeys(collectionId: string, contentId: string): Promise<CollectionItem | null>;
}