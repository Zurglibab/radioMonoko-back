import { randomUUID } from 'node:crypto';
import { ReviewRepository } from './review.repository';
import { Review } from './review.types';
import { CreateReviewDTO, UpdateReviewDTO } from './review.dto';

export class ReviewService {
    constructor(private readonly repository: ReviewRepository) {}

    getAll(): Promise<Review[]> {
        return this.repository.findAll();
    }

    getById(id: string): Promise<Review | null> {
        return this.repository.findById(id);
    }

    getByContentId(contentId: string): Promise<Review[]> {
        return this.repository.findByContentId(contentId);
    }

    async create(dto: Omit<CreateReviewDTO, 'id'>): Promise<Review> {
        if (!dto.user_id || !dto.content_id) {
            throw new Error('user_id and content_id are required');
        }

        return this.repository.create({
            id: randomUUID(),
            user_id: dto.user_id,
            content_id: dto.content_id,
            comment: dto.comment,
        });
    }

    updateById(id: string, dto: UpdateReviewDTO): Promise<Review | null> {
        return this.repository.updateById(id, dto);
    }

    deleteById(id: string): Promise<Review | null> {
        return this.repository.deleteById(id);
    }
}

