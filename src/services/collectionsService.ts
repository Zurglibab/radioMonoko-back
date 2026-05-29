import { randomUUID } from 'node:crypto';
import { CollectionsRepository } from '../repository/collectionsRepository';
import { Collection } from '../interfaces/collectionsInterface';
import { CreateCollectionDTO, UpdateCollectionDTO } from '../DTO/collectionsDTO';
import { CollectionStatus, DEFAULT_COLLECTION_STATUS, isCollectionStatus } from '../enums/collectionStatusEnum';

const normalizeCollectionStatus = (status?: CollectionStatus): CollectionStatus => {
  if (!status) {
    return DEFAULT_COLLECTION_STATUS;
  }

  if (!isCollectionStatus(status)) {
    throw new Error(`invalid collection status: ${status}`);
  }

  return status;
};

export class CollectionsService {
  constructor(private readonly repository: CollectionsRepository) {}

  getAll(): Promise<Collection[]> {
    return this.repository.findAll();
  }

  getById(id: string): Promise<Collection | null> {
    return this.repository.findById(id);
  }

  async create(dto: Omit<CreateCollectionDTO, 'id'>): Promise<Collection> {
    if (!dto.user_id || !dto.name) {
      throw new Error('user_id and name are required');
    }

    return this.repository.create({
      id: randomUUID(),
      user_id: dto.user_id,
      name: dto.name,
      description: dto.description,
      is_public: dto.is_public ?? true,
      status: normalizeCollectionStatus(dto.status)
    });
  }

  updateById(id: string, dto: UpdateCollectionDTO): Promise<Collection | null> {
    return this.repository.updateById(id, {
      ...dto,
      ...(dto.status ? { status: normalizeCollectionStatus(dto.status) } : {})
    });
  }

  deleteById(id: string): Promise<Collection | null> {
    return this.repository.deleteById(id);
  }

  findByUserId(userId: string): Promise<Collection[]> {
    return this.repository.findByUserId(userId);
  }
}