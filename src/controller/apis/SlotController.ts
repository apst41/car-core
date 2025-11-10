import { Request, Response } from 'express';
import { Op, fn, literal } from 'sequelize';
import Slot from '../../entity/apps/Slot'; // Adjust path if needed
import moment from 'moment';

export const getAvailableSlots = async (req: Request, res: Response): Promise<any> => {
    try {
        const now = moment();
        const currentDate = now.format('YYYY-MM-DD');
        const currentTime = now.add(1, 'hour').format('HH:mm:ss');

        // Calculate date 7 days from now
        const sevenDaysLater = now.clone().add(7, 'days').format('YYYY-MM-DD');

        const slots = await Slot.findAll({
            attributes: ['id', 'date', 'time', 'slotCount'],
            where: {
                slotCount: {
                    [Op.gt]: 0,
                },
                [Op.and]: [
                    // Only fetch future slots (date + time >= now)
                    literal(`CONCAT(date, ' ', time) >= '${currentDate} ${currentTime}'`),
                    // Limit to next 7 days
                    {
                        date: {
                            [Op.lte]: sevenDaysLater
                        }
                    }
                ]
            },
            order: [['date', 'ASC'], ['time', 'ASC']],
        });

        const groupedMap = new Map<string, { id: number; time: string }[]>();

        slots.forEach(slot => {
            const date = slot.date;
            const startTime = moment(slot.time, 'HH:mm:ss');
            const endTime = startTime.clone().add(1, 'hour');

            // Format without ":00"
            const cleanStart = startTime.format('h:mm A').replace(':00', '');
            const cleanEnd = endTime.format('h:mm A').replace(':00', '');
            const formattedTimeRange = `${cleanStart}-${cleanEnd}`;

            const timeslotItem = {
                id: slot.id,
                time: formattedTimeRange,
            };

            if (!groupedMap.has(date)) {
                groupedMap.set(date, []);
            }

            groupedMap.get(date)?.push(timeslotItem);
        });

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



export const generateSlots = async (req: Request, res: Response): Promise<any> => {
    try {
        const { startHour, endHour, intervalMinutes, slotCount } = req.body;

        // ✅ Validate input
        if (
            startHour < 0 || startHour > 23 ||
            endHour <= startHour || endHour > 24 ||
            intervalMinutes <= 0 || intervalMinutes > 1440 ||
            slotCount <= 0
        ) {
            return res.status(400).json({ message: "Invalid input parameters" });
        }

        const allSlots: { date: string; time: string }[] = [];

        // ✅ Generate for 6 months (approx. 180 days)
        const daysToGenerate = 180;
        for (let dayOffset = 0; dayOffset < daysToGenerate; dayOffset++) {
            const date = moment().add(dayOffset, "days").format("YYYY-MM-DD");

            for (let hour = startHour; hour < endHour; hour++) {
                for (let minute = 0; minute < 60; minute += intervalMinutes) {
                    const time = moment({ hour, minute }).format("HH:mm:ss");
                    allSlots.push({ date, time });
                }
            }
        }

        // ✅ Fetch existing slots in that range
        const existing = await Slot.findAll({
            attributes: ["date", "time"],
            where: {
                [Op.or]: allSlots.map(slot => ({
                    date: slot.date,
                    time: slot.time,
                })),
            }
        });

        const existingSet = new Set(existing.map(s => `${s.date} ${s.time}`));

        // ✅ Create only missing slots
        const uniqueToCreate = allSlots
            .filter(slot => !existingSet.has(`${slot.date} ${slot.time}`))
            .map(slot => ({
                ...slot,
                slotCount,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

        if (uniqueToCreate.length > 0) {
            await Slot.bulkCreate(uniqueToCreate, {
                ignoreDuplicates: true,
            });
        }

        return res.status(200).json({
            message: "Slots generated for 6 months (idempotent)",
            total: allSlots.length,
            created: uniqueToCreate.length,
            skipped: allSlots.length - uniqueToCreate.length,
        });
    } catch (error) {
        console.error("Slot generation error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};