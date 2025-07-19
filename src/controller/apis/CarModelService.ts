import { Request, Response } from "express";
import CarModel from "../../entity/apps/CarModel";

export const getCarModel = async (req: Request, res: Response): Promise<any> => {

    try {
        const { manufacturerId } = req.params;
        const carModel = await CarModel.findAll({
            where: { manufacturerId:manufacturerId }// Optional: selected ones first
        });

        return res.status(200).json({
            message:"CarModels fetch successfully",
            data:carModel
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

};