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
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
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
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
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
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
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

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Récupérer la liste des utilisateurs avec pagination
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Numéro de page (par défaut 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Nombre d'utilisateurs par page (par défaut 50)
 *     responses:
 *       200:
 *         description: Liste paginée d'utilisateurs
 *       500:
 *         description: Erreur serveur
 */
router.get('/users', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '50'), 10)));
    const offset = (page - 1) * limit;

    let users: any[] = [];
    let total = 0;

    try {
      const result = await (userDAO as any).findAll({ limit, offset });
      if (result && Array.isArray(result.rows)) {
        users = result.rows;
        total = typeof result.count === 'number' ? result.count : users.length;
      } else if (Array.isArray(result)) {
        const all = result as any[];
        total = all.length;
        users = all.slice(offset, offset + limit);
      } else {
        users = [];
        total = 0;
      }
    } catch {
      const all = await userDAO.findAll();
      total = Array.isArray(all) ? all.length : 0;
      users = Array.isArray(all) ? all.slice(offset, offset + limit) : [];
    }

    return res.status(200).json({
      data: users,
      meta: { page, limit, total },
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;