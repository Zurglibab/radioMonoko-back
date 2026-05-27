import { Router, Request, Response } from 'express';
import { ReviewDAO } from '../DAO/reviewDAO';
import { ReviewService } from '../services/reviewService';
import { UserDAO } from '../DAO/userDAO';

const router = Router();
const reviewRepository = new ReviewDAO();
const reviewService = new ReviewService(reviewRepository);
const userDAO = new UserDAO();





















router.delete('/reviews/:id', async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.id as string;
    const deleted = await reviewService.deleteById(reviewId);
    if (!deleted) return res.status(404).json({ message: 'Review not found' });
    return res.status(200).json(deleted);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});






























router.patch('/reviews/:id/feature', async (req: Request, res: Response) => {
  try {
    const { featured } = req.body as {featured?: boolean;};
    const reviewId = req.params.id as string;
    const updated = await reviewService.updateById(reviewId, { is_featured: featured === true });
    if (!updated) return res.status(404).json({ message: 'Review not found' });
    return res.status(200).json(updated);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});






























router.patch('/users/:id/ban', async (req: Request, res: Response) => {
  try {
    const { ban } = req.body as {ban?: boolean;};
    const userId = req.params.id as string;
    const user = await userDAO.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const updated = await userDAO.edit({ id: userId, is_banned: ban === true });
    return res.status(200).json(updated);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;