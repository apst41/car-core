import { Request, Response } from "express";
import PriceMapper from "../entity/PriceMapper"; // adjust path as needed

export const getPrice = async (req: Request, res: Response): Promise<any> => {
    const { packageId, carModelId } = req.query;

    if (!packageId || !carModelId) {
        return res.status(400).json({ message: "Missing packageId or carModelId" });
    }

    try {
        const priceEntry = await PriceMapper.findOne({
            where: {
                packageId: packageId as string,
                carModelId: Number(carModelId),
            },
        });

        if (!priceEntry) {
            return res.status(404).json({ message: "Price not found for given package and car model" });
        }

        return res.status(200).json({ price: priceEntry.price });
    } catch (error) {
        console.error("Error fetching price:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
