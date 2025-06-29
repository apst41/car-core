import { Request, Response } from "express";
import UserVehicle from "../entity/UserVehicle";
import Manufacturer from "../entity/Manufacturer";
import CarModel from "../entity/CarModel"; // Adjust the path as needed

export const addVehicle = async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).user?.id;
    const {isSelected,carModelId } = req.body;

    if (!userId || !carModelId) {
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


        const carModel = await CarModel.findByPk(carModelId);

        if(!carModel) {
            return res.status(200).json({ message: "Car not found" });
        }

        // Create new vehicle entry
        const newVehicle = await UserVehicle.create({
            userId,
            carModelId,
            manufacturerId:carModel.manufacturerId,
            isSelected: isSelected ?? false,
        });

        return res.status(201).json({
            message: "Manufacturer added successfully",
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
        const userVehicles = await UserVehicle.findAll({
            where: { userId },
            order: [["isSelected", "DESC"], ["id", "ASC"]],
        });

        if (!userVehicles || userVehicles.length === 0) {
            return res.status(200).json({ message: "No vehicles found for the user" });
        }

        const vehicleDetails = await Promise.all(
            userVehicles.map(async (userVehicle) => {
                const manufacturer = await Manufacturer.findOne({
                    where: { id: userVehicle.manufacturerId },
                    attributes: ["manufacturer", "manufacturerImage"],
                });

                const carModel = await CarModel.findByPk(userVehicle.carModelId, {
                    attributes: ["modelName"]
                });

                return {
                    ...userVehicle.get(),
                    vehicle: {
                        manufacturer: manufacturer?.manufacturer ?? null,
                        manufacturerImage: manufacturer?.manufacturerImage ?? null,
                        modelName: carModel?.modelName ?? null,
                    },
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
            return res.status(200).json({ message: "UserVehicle not found" });
        }

        const vehicle = await Manufacturer.findOne({ where: { id: userVehicle.manufacturerId } });

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
            return res.status(200).json({ message: "UserVehicle not found" });
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
            message: "Manufacturer selection updated successfully",
            data: userVehicle,
        });
    } catch (error) {
        console.error("Error updating vehicle selection:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUserVehicle = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;  // This is the userVehicleId from the URL parameter
    const userId = (req as any).user?.id;

    try {
        // Find the UserVehicle by userVehicleId (id from params)
        const userVehicle = await UserVehicle.findOne({
            where: {
                id,
                userId,
            },
        });

        if (!userVehicle) {
            return res.status(200).json({ message: "Manufacturer not found for the user" });
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
