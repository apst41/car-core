import { Request, Response } from "express";
import UserAddress from "../../entity/apps/UserAddress";
import Cities from "../../entity/apps/Cities";

// Add Address
export const addAddress = async (req: Request, res: Response): Promise<any> => {
    try {
        const { latitude, longitude, tag, addressText, city, cityId,pincode, isSelected } = req.body;

        const userId = (req as any).user.id;

        if (!userId || !addressText || !city || !pincode || !cityId) {
            return res.status(400).json({ message: "userId, addressText, city, cityId and pincode are required" });
        }

        // If isSelected is true, set all previous addresses to false
        if (isSelected === true) {
            await UserAddress.update(
                { isSelected: false },
                { where: { userId } }
            );
        }

        const dbCity = await Cities.findOne({ where: { userId } });

        const address = await UserAddress.create({
            userId,
            latitude,
            longitude,
            tag,
            addressText,
            city,
            cityId: cityId,
            pincode,
            isSelected: isSelected === true // ensure it's stored correctly
        });

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
            return res.status(200).json({ message: "Address not found" });
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
        const { latitude, longitude, tag, addressText,city,pincode } = req.body;

        if (!addressId) {
            return res.status(400).json({ message: "Address ID is required" });
        }

        const address = await UserAddress.findOne({ where: { id: addressId } });

        if (!address) {
            return res.status(200).json({ message: "Address not found" });
        }

        await address.update({ latitude, longitude, tag, addressText,city,pincode });

        return res.status(200).json(address);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateSelection = async (req: Request, res: Response): Promise<any> => {
    try {
        const { addressId } = req.params;
        const userId = (req as any).user?.id; // Fetch userId from request object

        if (!addressId) {
            return res.status(400).json({ message: "Address ID is required" });
        }

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }

        // Step 1: Set all addresses for this user to isSelected = false
        await UserAddress.update(
            { isSelected: false },
            { where: { userId } }
        );

        // Step 2: Set the selected address to isSelected = true
        const [updatedCount] = await UserAddress.update(
            { isSelected: true },
            { where: { id: addressId, userId } }
        );

        if (updatedCount === 0) {
            return res.status(200).json({ message: "Address not found or does not belong to the user" });
        }

        // Fetch the updated address to return
        const updatedAddress = await UserAddress.findOne({ where: { id: addressId } });

        return res.status(200).json(updatedAddress);
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
        return res.status(200).json(addresses);
    } catch (error) {
        console.error("Error fetching user addresses:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
