import { Request, Response } from "express";
import Cities from "../entity/Cities";
export const getCities = async (req: Request, res: Response): Promise<any> => {

    try {
        const cities = await Cities.findAll();
        return res.status(200).json(cities);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
    
};