import { Request, Response } from 'express';
import { LikeReviewService } from './likeReview.service';

export class LikeReviewController {
    constructor(private readonly service: LikeReviewService) {}

    upsert = async (req: Request, res: Response) => {
        try {
            const created = await this.service.upsert({
                review_id: req.params.reviewId as string,
                user_id: req.body.user_id,
                is_like: req.body.is_like,
            });
            res.status(201).json(created);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    deleteByReviewIdAndUserId = async (req: Request, res: Response) => {
        try {
            const deleted = await this.service.deleteByReviewIdAndUserId(
                req.params.reviewId as string,
                req.body.user_id as string
            );

            if (!deleted) {
                return res.status(404).json({ message: 'LikeReview not found' });
            }

            res.status(200).json(deleted);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    getByReviewId = async (req: Request, res: Response) => {
        try {
            const likes = await this.service.getByReviewId(req.params.reviewId as string);
            res.status(200).json(likes);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    getCountByReviewId = async (req: Request, res: Response) => {
        try {
            const count = await this.service.getCountByReviewId(req.params.reviewId as string);
            res.status(200).json(count);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}

