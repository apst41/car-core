import { Request, Response, NextFunction } from "express";
import User from "../../entity/User";
import NodeCache from "node-cache";

const myCache = new NodeCache();

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Access denied. No token provided." });
            return;
        }

        let cachedUser = myCache.get<User>(token);
        if (cachedUser) {
            (req as any).user = cachedUser; // Attach user to request
            next(); // Continue to next middleware/controller
            return;
        }

        const user = await User.findOne({ where: { token } });

        if (!user) {
            res.status(401).json({ message: "Access denied. Invalid token." });
            return;
        }

        (req as any).user = user; // Attach user to request
        myCache.set(token, user, 3600);
        next();
    } catch (error) {
        next(error); // Properly pass errors to Express error handler
    }
};
