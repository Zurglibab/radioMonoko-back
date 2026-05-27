import { Request, Response, NextFunction } from 'express';

// Middleware factory: ensures the authenticated user is either the owner indicated by the
// path parameter `paramName` or has role 'admin'. Returns 403 otherwise.
export const ownershipOrAdmin = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).user;
      if (!authUser || !authUser.id) {
        return res.status(401).json({ message: 'Non autorisé' });
      }

      const targetId = req.params[paramName];
      if (!targetId) {
        // If no target provided, allow (controller may handle defaulting)
        return next();
      }

      // Admin bypass
      if (authUser.role && authUser.role === 'admin') {
        return next();
      }

      if (authUser.id === targetId) {
        return next();
      }

      return res.status(403).json({ message: 'Forbidden: not owner' });
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  };
};

export default ownershipOrAdmin;

