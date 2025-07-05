import { Request, Response } from "express";
import Event from "../models/Event";

export const createEventController = async (req: Request, res: Response) => {
    try {
        const { title, description, date, location, link, physical } = req.body;
        if (!title || !date) {
            return res.status(400).json({ success: false, message: "Title, date, and location are required." });
        }

        const event = new Event({ title, description, date: new Date(date), location, link, physical });
        await event.save();

        res.status(201).json({ success: true, event });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getAllEventsController = async (req: Request, res: Response) => {
    try {
        const search = (req.query.search as string || '').trim().toLowerCase();
        const filter: any = {
            isApproved: true,
        };

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const events = await Event.find(filter).sort({ date: 1 });
        res.json({ success: true, events });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateEventController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        const event = await Event.findByIdAndUpdate(id, updateFields, { new: true });

        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found." });
        }

        res.json({ success: true, event });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
