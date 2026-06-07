import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { getClient } from '../config/RedisConnexion';
import logger from '../config/logger';
import { UserDAO } from '../DAO/userDAO';

declare global {
  namespace Express {
    interface Request {
      user?: {id: string;email: string;};
      userId?: string;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

  // In test environment, bypass JWT verification to keep route unit/integration tests simple.
  // In test/Jest runs, only bypass JWT verification if there is no Authorization header.
  const authHeaderPresent = !!req.headers.authorization?.startsWith('Bearer ');
  // Only auto-inject a test user when explicitly configured via TEST_AUTH_USER_ID.
  // This avoids hiding missing-token behaviors for tests that expect 401.
  if ((process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) && !authHeaderPresent && process.env.TEST_AUTH_USER_ID) {
    // Only inject the test user if it actually exists in the database. If not, return 401 so
    // tests that expect unauthenticated responses continue to behave correctly.
    try {
      const userDAO = new UserDAO();
      const testUser = await userDAO.findById(process.env.TEST_AUTH_USER_ID as string);
      if (!testUser) {
        logger.warn('[auth.middleware] test user not found: ' + process.env.TEST_AUTH_USER_ID);
        return res.status(401).json({ message: "Non autorisé: Token manquant ou invalide." });
      }
      (req as any).userId = process.env.TEST_AUTH_USER_ID;
      (req as any).user = { id: (req as any).userId, email: (testUser as any).email || 'test@example.com', ...(testUser.role ? { role: (testUser as any).role } : {}) } as any;
      return next();
    } catch (err) {
      logger.error('[auth.middleware] test user check failed: ' + (err as any)?.message);
      return res.status(401).json({ message: "Non autorisé: Token manquant ou invalide." });
    }
  }

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Non autorisé: Token manquant" });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Check token blacklist in Redis (support logout/token revocation)
    try {
      const redis = getClient();
      if (redis?.isOpen) {
        const isBlacklisted = await redis.get(`blacklist:${token}`);
        if (isBlacklisted) {
          return res.status(401).json({ message: 'Token revoked' });
        }
      }
    } catch (rbErr) {
      // Redis errors should not block authentication; log and continue
      logger.error('[auth.middleware] Redis check failed ' + (rbErr as any)?.message);
    }
    // Ensure JWT secret is configured
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('[auth.middleware] JWT_SECRET not configured');
      return res.status(500).json({ message: 'Server misconfigured' });
    }

    const decoded = jwt.verify(token, jwtSecret) as {id: string;email: string;role?: string;iat: number;exp: number;};
    const userDAO = new UserDAO();
    const user = await userDAO.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Non autorisé: utilisateur introuvable.' });
    }

    if ((user as any).is_banned) {
      return res.status(403).json({ message: 'Compte banni.' });
    }

    req.user = { id: decoded.id, email: decoded.email, ...(decoded.role ? { role: decoded.role } : {}) } as any;
    req.userId = decoded.id;
    next();
  } catch (error) {
    logger.error('Error verifying token: ' + (error as any)?.message);
    return res.status(401).json({ message: "Non autorisé: Token invalide ou expiré." });
  }
};