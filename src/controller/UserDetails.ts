import { Request, Response } from "express";
import User from "../entity/User";

export const getUserDetails = async (req: Request, res: Response): Promise<any> => {

    const id = (req as any).user.id;
    
    if (!id) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {

        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(200).json({ message: "User not found" });
        }
        return res.status(200).json({
            id:user.id,
            name: user.name,
            email: user.email,
            mobileNo: user.mobileNo,
         });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};