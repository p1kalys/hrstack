import { Request, Response } from "express";
import Blog from "../models/Blog";
import Comment from "../models/Comment";

export const getAllBllogsAdmin = async (req: Request, res: Response) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
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


export const getDashboard = async (req: Request, res: Response) => {
    try {
        const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
        const blogs = await Blog.countDocuments();
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