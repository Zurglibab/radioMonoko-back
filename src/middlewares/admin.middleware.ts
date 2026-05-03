import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { id: string; email: string; role?: string } | undefined;
    const role = user?.role;

    if (!role) {
        return res.status(403).json({ message: 'Accès refusé: rôle non présent.' });
    }

    if (role !== 'admin') {
        return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
    }

    next();
};

