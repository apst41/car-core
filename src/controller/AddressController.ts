import { Request, Response } from "express";
import UserAddress from "../entity/UserAddress";

// Add Address
export const addAddress = async (req: Request, res: Response): Promise<any> => {
    try {
        const { latitude, longitude, tag, addressText } = req.body;

        const userId = (req as any).user.id; // Ensure TypeScript recognizes `req.user`

        if (!userId || !addressText) {
            return res.status(400).json({ message: "userId and addressText are required" });
        }

        const address = await UserAddress.create({ userId, latitude, longitude, tag, addressText });
        return res.status(201).json(address);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Address
export const deleteAddress = async (req: Request, res: Response): Promise<any> => {
    try {
        const { addressId } = req.params; // Get Address ID from path

        if (!addressId) {
            return res.status(400).json({ message: "Address ID is required" });
        }

        const deleted = await UserAddress.destroy({ where: { id: addressId } });

        if (!deleted) {
            return res.status(404).json({ message: "Address not found" });
        }

        return res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Update Address
export const updateAddress = async (req: Request, res: Response): Promise<any> => {
    try {
        const { addressId } = req.params; // Get Address ID from path
        const { latitude, longitude, tag, addressText } = req.body;

        if (!addressId) {
            return res.status(400).json({ message: "Address ID is required" });
        }

        const address = await UserAddress.findOne({ where: { id: addressId } });

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        await address.update({ latitude, longitude, tag, addressText });

        return res.status(200).json(address);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserAddresses = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).user.id;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        // Fetch all addresses for the user
        const addresses = await UserAddress.findAll({ where: { userId } });

        if (!addresses.length) {
            return res.status(404).json({ message: "No addresses found for this user" });
        }

        return res.status(200).json(addresses);
    } catch (error) {
        console.error("Error fetching user addresses:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
