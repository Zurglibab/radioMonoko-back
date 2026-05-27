import { Router, Request, Response } from 'express';
import { ReviewDAO } from '../DAO/reviewDAO';
import { ReviewService } from '../services/reviewService';
import { UserDAO } from '../DAO/userDAO';

const router = Router();
const reviewRepository = new ReviewDAO();
const reviewService = new ReviewService(reviewRepository);
const userDAO = new UserDAO();

/**
 * @openapi
 * /admin/reviews/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Supprimer une critique en tant qu'administrateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Critique supprimée
 *       404:
 *         description: Critique introuvable
 */
// Delete a review (admin)
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

/**
 * @openapi
 * /admin/reviews/{id}/feature:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Mettre une critique en avant ou la retirer des coups de cœur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               featured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Critique mise à jour
 *       404:
 *         description: Critique introuvable
 */
// Feature/unfeature a review
router.patch('/reviews/:id/feature', async (req: Request, res: Response) => {
  try {
    const { featured } = req.body as { featured?: boolean };
    const reviewId = req.params.id as string;
    const updated = await reviewService.updateById(reviewId, { is_featured: featured === true });
    if (!updated) return res.status(404).json({ message: 'Review not found' });
    return res.status(200).json(updated);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

/**
 * @openapi
 * /admin/users/{id}/ban:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Bannir ou débannir un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ban:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur introuvable
 */
// Ban/unban a user
router.patch('/users/:id/ban', async (req: Request, res: Response) => {
  try {
    const { ban } = req.body as { ban?: boolean };
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