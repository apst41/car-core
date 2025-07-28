import {Request, Response} from "express";
import { Op} from "sequelize";


import Booking from "../../entity/apps/Booking";
import {getCachedAddressById, getPackagePartnerById, getUser} from "../middleware/PartnerCache";
import UserVehicle from "../../entity/apps/UserVehicle";
import CarModel from "../../entity/apps/CarModel";
import Slot from "../../entity/apps/Slot";
import Feedback from "../../entity/apps/Feedback";
import User from "../../entity/apps/User";

export const getPaginatedBookings = async (options: any) => {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;
    const status = options.status;
    const date = options.date;
    const userId = options.userId

    const where: any = {};

    if (status) {
        where.status = status;
    }

    if (userId){
        where.userId = userId
    }

    if (date) {
        const selectedDate = new Date(date);
        const nextDate = new Date(selectedDate);
        nextDate.setDate(selectedDate.getDate() + 1);

        where.createdAt = {
            [Op.gte]: selectedDate,
            [Op.lt]: nextDate,
        };
    }

    const { rows, count } = await Booking.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
    });

    return {
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        bookings: rows,
    };
};

export const fetchBookings = async (req: Request, res: Response): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string | undefined;
        const date  = req.query.date as string;
        const mobileNo = req.query.mobileNo as string;
        let userId
        if (mobileNo) {
           const  user = await User.findOne({where: {mobileNo: mobileNo}});
           if (user){
               userId = user.id;
           }

        }



        // Pass status to getPaginatedBookings if present
        const data = await getPaginatedBookings({ page, limit, status,date,userId });
        const bookings = data.bookings;

        const response = await Promise.all(
            bookings.map(async (booking: any) => {
                const jsonBooking = booking.toJSON();

                const address = await getCachedAddressById(jsonBooking.addressId);
                const pkg = await getPackagePartnerById(jsonBooking.packageId);
                const user = await getUser(booking.userId);
                const userVehicle = await UserVehicle.findByPk(booking.userVehicleId, {
                    attributes: ['carModelId'],
                });

                const slotData = await Slot.findByPk(booking.slotId, {
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                });

                const feedback = await Feedback.findOne({ where: { bookingId: booking.id } });


                let carData = null;
                if (userVehicle?.carModelId) {
                    carData = await CarModel.findByPk(userVehicle.carModelId, {
                        attributes: { exclude: ['createdAt', 'updatedAt','modelImage'] },
                    });
                }



                return {
                    booking: {
                        ...jsonBooking,
                        address,
                        package: pkg,
                        user,
                        carDetail: carData,
                        slotDetail: slotData,
                        feedbackDetail:feedback
                    }
                };
            })
        );

        res.status(200).json({
            message: "Booking details",
            data: response,
            meta: {
                page: data.page,
                total: data.total,
                totalPages: data.totalPages
            }
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const updateBookingStatus = async (req: Request, res: Response): Promise<any> => {
    try {
        const bookingId = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const booking = await Booking.findByPk(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = status;
        await booking.save();

        return res.status(200).json({
            message: "Booking status updated successfully",
            data: booking
        });
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const fetchBookingsById = async (req: Request, res: Response): Promise<any> => {
    try {
        const bookingId = req.params.id

        if (!bookingId) {
            return res.status(400).json({ message: "Booking ID is required" });
        }

        const booking = await Booking.findByPk(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const jsonBooking = booking.toJSON();

        const address = await getCachedAddressById(jsonBooking.addressId);
        const pkg = await getPackagePartnerById(jsonBooking.packageId);
        const user = await getUser(booking.userId);

        const userVehicle = await UserVehicle.findByPk(booking.userVehicleId, {
            attributes: ['carModelId'],
        });

        const slotData = await Slot.findByPk(booking.slotId, {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        });

        const feedback = await Feedback.findOne({ where: { bookingId: booking.id } });

        let carData = null;
        if (userVehicle?.carModelId) {
            carData = await CarModel.findByPk(userVehicle.carModelId, {
                attributes: { exclude: ['createdAt', 'updatedAt', 'modelImage'] },
            });
        }

        const response = {
            booking: {
                ...jsonBooking,
                address,
                package: pkg,
                user,
                carDetail: carData,
                slotDetail: slotData,
                feedbackDetail: feedback
            }
        };

        res.status(200).json({
            message: "Booking details",
            data: response
        });

    } catch (error) {
        console.error("Error fetching booking by ID:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

