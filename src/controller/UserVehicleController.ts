import { Request, Response } from "express";
import UserVehicle from "../entity/UserVehicle";
import Vehicle from "../entity/Vehicle"; // Adjust the path as needed

export const addVehicle = async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).user?.id;
    const { vehicleId, isSelected } = req.body;

    if (!userId || !vehicleId) {
        return res.status(400).json({ message: "userId and vehicleId are required" });
    }

    try {
        // If the current vehicle is being selected, unselect all previous
        if (isSelected === true) {
            await UserVehicle.update(
                { isSelected: false },
                { where: { userId, isSelected: true } }
            );
        }

        // Create new vehicle entry
        const newVehicle = await UserVehicle.create({
            userId,
            vehicleId,
            isSelected: isSelected ?? false,
        });

        return res.status(201).json({
            message: "Vehicle added successfully",
            data: newVehicle,
        });
    } catch (error) {
        console.error("Error adding vehicle:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserVehicles = async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).user?.id;

    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        // Fetch all user vehicles for the given user
        const userVehicles = await UserVehicle.findAll({
            where: { userId },
            order: [["isSelected", "DESC"], ["id", "ASC"]], // Optional: selected ones first
        });

        if (!userVehicles || userVehicles.length === 0) {
            return res.status(404).json({ message: "No vehicles found for the user" });
        }

        // Get vehicle details based on vehicleId
        const vehicleDetails = await Promise.all(
            userVehicles.map(async (userVehicle) => {
                const vehicle = await Vehicle.findOne({
                    where: { id: userVehicle.vehicleId },
                    attributes: [
                        "id",
                        "manufacturer",
                        "model",
                        "type",
                        "manufacturerImage",
                        "modelImage",
                    ],
                });

                return {
                    ...userVehicle.get(), // Include all fields from UserVehicle
                    vehicle: vehicle ? vehicle.get() : null, // Merge vehicle details with userVehicle
                };
            })
        );

        return res.status(200).json({
            message: "Vehicles fetched successfully",
            data: vehicleDetails,
        });
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserVehicleById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "UserVehicle ID is required" });
    }

    try {
        const userVehicle = await UserVehicle.findOne({ where: { id } });

        if (!userVehicle) {
            return res.status(404).json({ message: "UserVehicle not found" });
        }

        const vehicle = await Vehicle.findOne({ where: { id: userVehicle.vehicleId } });

        return res.status(200).json({
            message: "UserVehicle fetched successfully",
            data: {
                ...userVehicle.toJSON(),
                vehicle: vehicle ? vehicle.toJSON() : null,
            },
        });
    } catch (error) {
        console.error("Error fetching UserVehicle:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateVehicleSelection = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;  // This is the userVehicleId from the URL parameter

    try {
        // Find the UserVehicle by userVehicleId (id from params)
        const userVehicle = await UserVehicle.findByPk(id);

        if (!userVehicle) {
            return res.status(404).json({ message: "UserVehicle not found" });
        }

        // If there's any other vehicle selected, unselect it
        const previouslySelectedVehicle = await UserVehicle.findOne({
            where: { userId: userVehicle.userId, isSelected: true },
        });

        if (previouslySelectedVehicle && previouslySelectedVehicle.id !== userVehicle.id) {
            // Unselect the previously selected vehicle
            previouslySelectedVehicle.isSelected = false;
            await previouslySelectedVehicle.save();
        }

        // Now set the current vehicle as selected (isSelected = true)
        userVehicle.isSelected = true;
        await userVehicle.save();

        return res.status(200).json({
            message: "Vehicle selection updated successfully",
            data: userVehicle,
        });
    } catch (error) {
        console.error("Error updating vehicle selection:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUserVehicle = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;  // This is the userVehicleId from the URL parameter

    try {
        // Find the UserVehicle by userVehicleId (id from params)
        const userVehicle = await UserVehicle.findByPk(id);

        if (!userVehicle) {
            return res.status(404).json({ message: "UserVehicle not found" });
        }

        // Delete the UserVehicle
        await userVehicle.destroy();

        return res.status(200).json({
            message: "UserVehicle deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting UserVehicle:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
