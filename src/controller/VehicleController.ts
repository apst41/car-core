import { Request, Response } from "express";
import Manufacturer from "../entity/Manufacturer";  // Import your Manufacturer model

export const addBackendVehicle = async (req: Request, res: Response): Promise<any> => {
    const { manufacturer, model, type, manufacturerImage, modelImage } = req.body;

    // Validate required fields
    if (!manufacturer || !model || !type) {
        return res.status(400).json({ message: "Manufacturer, model, and type are required" });
    }

    try {
        // Create a new Manufacturer instance
        const newVehicle = await Manufacturer.create({
            manufacturer,
            model,
            type,
            manufacturerImage,  // Optional
            modelImage,          // Optional
        });

        // Return success message with the newly created vehicle
        return res.status(201).json({
            message: "Manufacturer added successfully",
            data: newVehicle,
        });
    } catch (error) {
        console.error("Error adding vehicle:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllVehicles = async (req: Request, res: Response): Promise<any> => {
    try {
        // Fetch all vehicles from the database
        const vehicles = await Manufacturer.findAll();

        if (!vehicles || vehicles.length === 0) {
            return res.status(200).json({ message: "No vehicles found" });
        }

        // Return the list of vehicles
        return res.status(200).json({
            message: "Vehicles fetched successfully",
            data: vehicles,
        });
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
