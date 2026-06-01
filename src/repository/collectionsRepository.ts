import { Collection } from '../interfaces/collectionsInterface';
import { CreateCollectionDTO, UpdateCollectionDTO } from '../DTO/collectionsDTO';
import { PaginationOptions } from '../utils/pagination';

export interface CollectionsRepository {
  findAll(pagination?: PaginationOptions): Promise<Collection[]>;
  findById(id: string): Promise<Collection | null>;
  create(collection: CreateCollectionDTO): Promise<Collection>;
  updateById(id: string, collection: UpdateCollectionDTO): Promise<Collection | null>;
  deleteById(id: string): Promise<Collection | null>;
  findByUserId(userId: string, pagination?: PaginationOptions): Promise<Collection[]>;
}