import { Request, Response, NextFunction } from "express";
import User from "../../entity/apps/User";
import NodeCache from "node-cache";

export const myCache = new NodeCache();

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Access denied. No token provided." });
            return;
        }

        // Check cache first (assuming you have myCache setup)
        let cachedUser = myCache.get<User>(token);
        if (cachedUser) {
            // Also check tokenExpiry in cached user if available
            if (cachedUser.tokenExpiry && new Date() > cachedUser.tokenExpiry) {
                myCache.del(token); // Remove expired token from cache
                res.status(401).json({ message: "Token expired." });
                return;
            }
            (req as any).user = cachedUser;
            next();
            return;
        }

        // Find user by token from DB
        const user = await User.findOne({ where: { token } });

        if (!user) {
            res.status(401).json({ message: "Access denied. Invalid token." });
            return;
        }

        // Check if token expired
        if (!user.tokenExpiry || new Date() > user.tokenExpiry) {
            res.status(401).json({ message: "Token expired." });
            return;
        }

        (req as any).user = user;
        myCache.set(token, user, 3600); // Cache for 1 hour
        next();
    } catch (error) {
        next(error);
    }
};
