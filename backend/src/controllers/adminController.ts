import { Request, Response } from "express";
import Blog from "../models/Blog";
import Comment from "../models/Comment";
import Event from "../models/Event";
import Job from "../models/Job";

export const getAllBlogsAdmin = async (req: Request, res: Response) => {
    try {
        const blogs = await Blog.find({isFromRss: {$ne: true}}).sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (error: any) {
        res.json({ success: false, message: error.message })
    }
}

export const getAllCommentsAdmin = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;
        const comments = await Comment.find({}).populate("blog").sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error: any) {
        res.json({ success: false, message: error.message })
    }
}

export const getAllEventsAdmin = async (req: Request, res: Response) => {
    try {
        const events = await Event.find({}).sort({ date: 1 });
        res.json({ success: true, events });
    } catch (error: any) {
        res.json({ success: false, message: error.message })
    }
}

export const getAllJobsAdmin = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.find({}).sort({ date: 1 });
        res.json({ success: true, jobs });
    } catch (error: any) {
        res.json({ success: false, message: error.message })
    }
}

export const getDashboardAdmin = async (req: Request, res: Response) => {
    try {
        const recentBlogs = await Blog.find({isFromRss: {$ne: true}}).sort({ createdAt: -1 }).limit(5);
        const blogs = await Blog.countDocuments({ isFromRss: {$ne: true} });
        const comments = await Comment.countDocuments();
        const drafts = await Blog.countDocuments({ isPublished: false });
        const dashboardData = { blogs, recentBlogs, comments, drafts }
        res.json({ success: true, dashboardData });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const deleteCommentbyId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Comment.findByIdAndDelete(id);
        res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const approveCommentbyId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Comment.findByIdAndUpdate(id, { isApproved: true });
        res.json({ success: true, message: "Comment approved successfully" });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const approveEventbyId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Event.findByIdAndUpdate(id, { isApproved: true });
        res.json({ success: true, message: "Event approved successfully" });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const deleteEventbyId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Event.findByIdAndDelete(id);
        res.json({ success: true, message: "Event deleted successfully" });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const approveJobbyId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Job.findByIdAndUpdate(id, { isApproved: true });
        res.json({ success: true, message: "Job approved successfully" });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const deleteJobbyId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Job.findByIdAndDelete(id);
        res.json({ success: true, message: "Job deleted successfully" });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}