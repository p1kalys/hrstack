import fs from 'fs';
import { Request, Response } from "express";
import Event from "../models/Event";
import imagekit from '../config/imagekit';
import Job from '../models/Job';

export const createJobController = async (req: Request, res: Response) => {
    try {
        const { title, description, company, location, link } = req.body;

        let imageUrl: string | undefined = undefined;

        if (req.file) {
            const imageFile = req.file;
            const fileBuffer = fs.readFileSync(imageFile.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: imageFile.originalname,
                folder: "/blogs",
            });

            fs.unlinkSync(imageFile.path);

            imageUrl = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' },
                ],
            });
        }

        const job = new Job({
            title,
            description,
            company,
            location,
            link,
            imageUrl,
        });

        await job.save();

        return res.status(201).json({ success: true, job });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};



export const getAllJobsController = async (req: Request, res: Response) => {
    try {
        const filter: any = {
            isApproved: true,
        };

        const jobs = await Job.find(filter).sort({ date: 1 }); 
        res.json({ success: true, jobs });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateJobController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        const job = await Job.findByIdAndUpdate(id, updateFields, { new: true });

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }

        res.json({ success: true, job });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
