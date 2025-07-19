import {Request, Response} from "express";


import Booking from "../../entity/apps/Booking";
import {getCachedAddressById, getPackagePartnerById, getUser} from "../middleware/PartnerCache";

export const getPaginatedBookings = async (options: any) => {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    const {rows, count} = await Booking.findAndCountAll({
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

        const data = await getPaginatedBookings({ page, limit });
        const bookings = data.bookings;

        const response = await Promise.all(
            bookings.map(async (booking: any) => {
                const jsonBooking = booking.toJSON();

                const address = await getCachedAddressById(jsonBooking.addressId);
                const pkg = await getPackagePartnerById(jsonBooking.packageId);
                const user = await getUser(booking.userId);

                return {
                    booking: {
                        ...jsonBooking,
                        address,
                        package: pkg,
                        user
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



