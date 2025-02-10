import { Request, Response } from "express";
import User from "../entity/User";

export const getUserDetails = async (req: Request, res: Response): Promise<any> => {

    const { userId } = req.params;
    
    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
    
        const id = userId

        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ 
            name: user.name,
            email: user.email,
            matchMedia: user.mobileNo,
         });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};