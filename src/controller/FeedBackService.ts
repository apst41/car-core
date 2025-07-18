import { Request, Response } from "express";
import Feedback from "../entity/Feedback";
import Booking from "../entity/Booking";

export const saveFeedback = async (req: Request, res: Response): Promise<any> => {
    try {
        const {rating, comment,bookingId } = req.body;
        const userId = (req as any).user?.id;

        if (!userId || !rating || !bookingId) {
            return res.status(200).json({ message: "userId,bookingId and rating are required" });
        }

        const BookingDate =  await  Booking.findByPk(bookingId)

        if (!BookingDate) {
            return res.status(200).json({ message: "bookingId is invalid" });
        }

        const feedback = await Feedback.create({
            userId,
            rating,
            comment,
            bookingId,
        });



        return res.status(201).json({
            message: "Feedback submitted successfully",
            feedbackId: feedback.id,
        });

    } catch (error) {
        console.error("Error saving feedback:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getFeedback = async (req: Request, res: Response): Promise<any> => {
    try {
        const feedbackList = await Feedback.findAll({
            attributes: ['id', 'userId', 'rating', 'comment', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            feedback: feedbackList
        });
    } catch (error) {
        console.error("Error fetching feedback:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getFeedbackById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findOne({
            where: { id },
            attributes: ['id', 'userId', 'rating', 'comment', 'createdAt']
        });

        if (!feedback) {
            return res.status(200).json({ message: "Feedback not found" });
        }

        return res.status(200).json({ feedback });

    } catch (error) {
        console.error("Error fetching feedback by ID:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
