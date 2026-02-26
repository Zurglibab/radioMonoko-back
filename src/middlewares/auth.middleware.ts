import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: { id: string; email: string };
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(404).json();
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string; iat: number; exp: number };
        req.user = { id: decoded.id, email: decoded.email };
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(404).json();
    }
};
