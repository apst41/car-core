import { Request, Response } from 'express';
import { Op, fn, literal } from 'sequelize';
import Slot from '../entity/Slot'; // Adjust path if needed
import moment from 'moment';

export const getAvailableSlots = async (req: Request, res: Response): Promise<any> => {
    try {
        const slots = await Slot.findAll({
            attributes: ['id', 'date', 'time'],
            where: {
                slotCount: {
                    [Op.gt]: 0,
                },
                [Op.and]: [
                    literal(`CAST(CONCAT(date, ' ', time) AS DATETIME) > NOW()`),
                ],
            },
            order: [['date', 'ASC'], ['time', 'ASC']],
        });

        // Group slots by date
        const groupedMap = new Map();

        slots.forEach(slot => {
            const date = slot.date;
            const formattedTime = moment(slot.time, 'HH:mm:ss').format('h:mm A');

            const timeslotItem = {
                id: slot.id,
                time: formattedTime,
            };

            if (!groupedMap.has(date)) {
                groupedMap.set(date, []);
            }

            groupedMap.get(date).push(timeslotItem);
        });

        // Build final response structure
        const available_dates = Array.from(groupedMap.entries()).map(([date, times]) => ({
            date,
            day: moment(date).format('dddd'),
            Timeslot: times,
        }));

        return res.status(200).json({ available_dates });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
