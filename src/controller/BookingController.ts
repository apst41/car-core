import { Request, Response } from "express";
import { Transaction } from "sequelize";
import Booking from "../entity/Booking";
import Slot from "../entity/Slot";
import UserAddress from "../entity/UserAddress";
import UserVehicle from "../entity/UserVehicle";
import Services from "../entity/Services"; // Assuming this is your service details entity
import sequelize from "../entity/Database";
import Packages from "../entity/Packages";
import PriceMapper from "../entity/PriceMapper";
import {calculatePrice} from "./PackagesController";

export const createBooking = async (req: Request, res: Response): Promise<any> => {
    const {
        userVehicleId,
        addressId,
        packageId,
        slotId,
        notes,
    } = req.body;

    const userId = (req as any).user?.id;
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

        const city = userAddress.city; // Get the city from user address

        // Validate if the provided userVehicleId exists for the user
        const userVehicle = await UserVehicle.findOne({ where: { id: userVehicleId, userId }, transaction });
        if (!userVehicle) {
            return res.status(400).json({ message: "Invalid userVehicleId for the user" });
        }

        const priceMapper = await PriceMapper.findOne({
            where: {
                packageId: packageId,
                carModelId: userVehicle.carModelId,
            }
        });

        if (!priceMapper) {
            return res.status(200).json({ message: "Price does not find" });
        }


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

        // Fetch the service details to calculate the final amount
        const packages = await Packages.findOne({
            where: { id: packageId },
            transaction,
        });



        if (!packages) {
            return res.status(200).json({ message: "Invalid packageId" });
        }

        const price = calculatePrice(priceMapper.price, packages.discount)


        // Now, create the booking entry
        const booking = await Booking.create(
            {
                userId,
                userVehicleId,
                addressId,
                packageId,
                slotId,
                price: priceMapper.price,
                discount: priceMapper.price-price,
                finalAmount: price,
                status:"PENDING",
                notes: notes || "",
                city
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
