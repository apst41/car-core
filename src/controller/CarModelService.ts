import { Request, Response } from "express";
import Cities from "../entity/CarModel";
export const getCarModel = async (req: Request, res: Response): Promise<any> => {

    try {
        const carMode = await Cities.findAll();
        return res.status(200).json(carMode);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

};