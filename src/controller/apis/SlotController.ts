import { Request, Response } from 'express';
import { Op, fn, literal } from 'sequelize';
import Slot from '../../entity/apps/Slot'; // Adjust path if needed
import moment from 'moment';

export const getAvailableSlots = async (req: Request, res: Response): Promise<any> => {
    try {
        // Get current date and time for comparison with explicit timezone handling
        const now = moment();
        const currentDate = now.format('YYYY-MM-DD');
        const currentTime = now.format('HH:mm:ss');
        // Use a more robust approach with datetime comparison
        const slots = await Slot.findAll({
            attributes: ['id', 'date', 'time', 'slotCount'],
            where: {
                slotCount: {
                    [Op.gt]: 0,
                },
                [Op.and]: [
                    literal(`CONCAT(date, ' ', time) >= '${currentDate} ${currentTime}'`)
                ]
            },
            order: [['date', 'ASC'], ['time', 'ASC']],
        });


        // Log first few slots for debugging
        if (slots.length > 0) {
            console.log('🔍 First 3 slots:', slots.slice(0, 3).map(s => `${s.date} ${s.time} (count: ${s.slotCount})`));
            
            // Additional debugging: Check if any slots are in the past
            const now = moment();
            const pastSlots = slots.filter(slot => {
                const slotDateTime = moment(`${slot.date} ${slot.time}`, 'YYYY-MM-DD HH:mm:ss');
                return slotDateTime.isBefore(now);
            });
            
            if (pastSlots.length > 0) {
                console.log('⚠️  WARNING: Found past slots that should be filtered out:');
                pastSlots.slice(0, 5).forEach(slot => {
                    console.log(`   - ${slot.date} ${slot.time} (count: ${slot.slotCount})`);
                });
            }
        }

        const groupedMap = new Map<string, { id: number; time: string }[]>();

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