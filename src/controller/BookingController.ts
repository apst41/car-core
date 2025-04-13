import { Request, Response } from "express";
import { Transaction } from "sequelize";
import Booking from "../entity/Booking";
import Slot from "../entity/Slot";
import UserAddress from "../entity/UserAddress";
import UserVehicle from "../entity/UserVehicle";
import sequelize from "../entity/Database";

export const createBooking = async (req: Request, res: Response): Promise<any> => {
    const {
        userVehicleId,
        addressId,
        serviceDetailsId,
        slotId,
        status,
        notes,
    } = req.body;

    const userId = (req as any).user?.id; // Fetch userId from request object
    if (!userId) {
        return res.status(400).json({ message: "User not authenticated" });
    }

    const transaction: Transaction = await sequelize.transaction(); // Start the transaction

    try {
        // Validate if the provided addressId exists for the user
        const userAddress = await UserAddress.findOne({ where: { id: addressId, userId }, transaction });
        if (!userAddress) {
            return res.status(400).json({ message: "Invalid addressId for the user" });
        }

        // Validate if the provided userVehicleId exists for the user
        const userVehicle = await UserVehicle.findOne({ where: { id: userVehicleId, userId }, transaction });
        if (!userVehicle) {
            return res.status(400).json({ message: "Invalid userVehicleId for the user" });
        }

        // First, reduce the slotCount by 1
        const slot = await Slot.findOne({ where: { id: slotId }, transaction });

        if (!slot) {
            return res.status(400).json({ message: "Slot not found" });
        }

        if (slot.slotCount <= 0) {
            return res.status(400).json({ message: "No available slots" });
        }

        // Reduce slotCount by 1
        slot.slotCount -= 1;
        await slot.save({ transaction }); // Save the updated slot count

        // Now, create the booking
        const booking = await Booking.create(
            {
                userId,
                userVehicleId,
                addressId,
                serviceDetailsId,
                slotId,
                status: status || "PENDING", // Default to "PENDING"
                notes: notes || "", // Default to empty string if no notes
            },
            { transaction } // Include transaction here for atomicity
        );

        // Commit the transaction
        await transaction.commit();

        return res.status(201).json({
            message: "Booking created successfully",
            booking,
        });
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
