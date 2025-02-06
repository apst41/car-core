import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/Utils';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Access denied, no token provided' });
        return;
    }

    try {
        const decoded = verifyToken(token);
        req.body.user = decoded; // Attach user info to the request
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
