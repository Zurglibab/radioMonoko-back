import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
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
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Non autorisé: Token manquant ou invalide." });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {id: string;email: string;role?: string;iat: number;exp: number;};
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
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: "Non autorisé: Token invalide ou expiré." });
  }
};