import { CollectionItemsRepository } from '../repository/collectionItemsRepository';
import { CollectionItem } from '../interfaces/collectionItemsInterface';
import { CreateCollectionItemDTO, UpdateCollectionItemDTO } from '../DTO/collectionItemsDTO';

export class CollectionItemsService {
  constructor(private readonly repository: CollectionItemsRepository) {}

  getAll(): Promise<CollectionItem[]> {
    return this.repository.findAll();
  }

  getByCollectionId(collectionId: string): Promise<CollectionItem[]> {
    return this.repository.findByCollectionId(collectionId);
  }

  getByKeys(collectionId: string, contentId: string): Promise<CollectionItem | null> {
    return this.repository.findByKeys(collectionId, contentId);
  }

  async create(dto: CreateCollectionItemDTO): Promise<CollectionItem> {
    if (!dto.collection_id || !dto.content_id) {
      throw new Error('collection_id and content_id are required');
    }
    return this.repository.create({
      collection_id: dto.collection_id,
      content_id: dto.content_id,
      position: dto.position ?? 0,
      note: dto.note
    });
  }

  updateByKeys(collectionId: string, contentId: string, dto: UpdateCollectionItemDTO): Promise<CollectionItem | null> {
    return this.repository.updateByKeys(collectionId, contentId, dto);
  }

  deleteByKeys(collectionId: string, contentId: string): Promise<CollectionItem | null> {
    return this.repository.deleteByKeys(collectionId, contentId);
  }
}