import { Content } from './content.types';
import { CreateContentDTO, UpdateContentDTO } from './content.dto';

export interface ContentRepository {
    findAll(): Promise<Content[]>;
    findById(id: string): Promise<Content | null>;
    create(content: CreateContentDTO): Promise<Content>;
    updateById(id: string, content: UpdateContentDTO): Promise<Content | null>;
    deleteById(id: string): Promise<Content | null>;
}

