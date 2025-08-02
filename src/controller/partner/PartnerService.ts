import { Request, Response } from "express";
import bcrypt from "bcrypt";
import PartnerUser from "../../entity/partner/PartnerUser";
import jwt from "jsonwebtoken";


// Partner-specific JWT secret - completely independent from main app
const PARTNER_JWT_SECRET = process.env.PARTNER_JWT_SECRET || "partner_secret_key_2024";

export const loginInUser = async (req: Request, res: Response): Promise<any> => {
    const {userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const user = await PartnerUser.findOne({ where: { username: userName } });

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "User account is inactive" });
        }

        const isPasswordValid = user.passwordHash
            ? await bcrypt.compare(password, user.passwordHash)
            : false;

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            PARTNER_JWT_SECRET,
            { expiresIn: "1d" }
        );

       await user.update({token: token});

        return res.status(200).json({
            message: "Login successful",
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                token: token,
                isActive: user.isActive,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};




export const signUpUser = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {

        const existingUser = await PartnerUser.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }


        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);


        const newUser = await PartnerUser.create({
            email,
            username: email.split("@")[0],
            mobileNo: "0000000000",
            passwordHash,
            isActive: false,
        });

        return res.status(201).json({
            message: "Signup successful",
            data: {
                id: newUser.id,
                email: newUser.email,
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logoutUser = async (req: Request, res: Response): Promise<any> => {
    try {
        // Partner user is already authenticated by middleware, so we can access it from req.partnerUser
        const partnerUser = (req as any).partnerUser;

        if (!partnerUser) {
            return res.status(401).json({ message: 'Partner not authenticated' });
        }

        // Clear the token from the database
        await partnerUser.update({
            token: null,
        });

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
