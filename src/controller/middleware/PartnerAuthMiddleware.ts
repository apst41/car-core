import { Request, Response, NextFunction } from "express";

import PartnerUser from "../../entity/partner/PartnerUser";


const PARTNER_JWT_SECRET = process.env.PARTNER_JWT_SECRET || "partner_secret_key_2024";


export const authenticatePartnerToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Access denied. No token provided." });
            return;
        }

        console.log("🔒 Token found, verifying...");


        const partnerUser = await PartnerUser.findOne({ where: { token: token } });

        if (!partnerUser) {
            res.status(401).json({ message: "Access denied. Invalid token." });
            return;
        }


        if (!partnerUser.isActive) {
            res.status(403).json({ message: "Partner account is inactive." });
            return;
        }

        // Attach user to request
        (req as any).partnerUser = partnerUser;

        return next();
    } catch (error) {
        console.error("Partner authentication error:", error);
        res.status(403).json({ message: "Partner account is inactive." });
        return
    }
};

// Optional: Add a function to get current partner user
export const getCurrentPartnerUser = (req: Request): PartnerUser | null => {
    return (req as any).partnerUser || null;
};

// Optional: Add a function to check if user is partner
export const isPartnerUser = (req: Request): boolean => {
    return !!(req as any).partnerUser;
}; 