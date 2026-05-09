import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserDAO } from '../DAO/userDAO';

declare global {
    namespace Express {
        interface Request {
            user?: { id: string; email: string };
            userId?: string;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Non autorisé: Token manquant ou invalide." });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string; email: string; role?: string; iat: number; exp: number };
        // Verify user exists and is not banned
        const userDAO = new UserDAO();
        req.user = { id: decoded.id, email: decoded.email, ...(decoded.role ? { role: decoded.role } : {}) } as any;
        req.userId = decoded.id;

        userDAO.findById(decoded.id).then((u) => {
            if (u && (u as any).is_banned) {
                return res.status(403).json({ message: 'Compte banni.' });
            }
            next();
        }).catch((err) => {
            console.error('Error fetching user in auth middleware:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: "Non autorisé: Token invalide ou expiré." });
    }
};
