import { Content } from '../interfaces/contentInterface';
import { CreateContentDTO, UpdateContentDTO } from '../DTO/contentDTO';
import { PaginationOptions } from '../utils/pagination';

export interface ContentRepository {
  findAll(pagination?: PaginationOptions): Promise<Content[]>;
  findById(id: string): Promise<Content | null>;
  findByApiId(apiId: string): Promise<Content | null>;
  create(content: CreateContentDTO): Promise<Content>;
  updateById(id: string, content: UpdateContentDTO): Promise<Content | null>;
  deleteById(id: string): Promise<Content | null>;
}