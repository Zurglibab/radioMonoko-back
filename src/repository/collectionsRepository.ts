import { Collection } from '../interfaces/collectionsInterface';
import { CreateCollectionDTO, UpdateCollectionDTO } from '../DTO/collectionsDTO';

export interface CollectionsRepository {
    findAll(): Promise<Collection[]>;
    findById(id: string): Promise<Collection | null>;
    create(collection: CreateCollectionDTO): Promise<Collection>;
    updateById(id: string, collection: UpdateCollectionDTO): Promise<Collection | null>;
    deleteById(id: string): Promise<Collection | null>;
    findByUserId(userId: string): Promise<Collection[]>;
}

