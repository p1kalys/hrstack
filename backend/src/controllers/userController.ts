import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { AuthenticatedRequest } from "../middleware/auth";
import Blog from "../models/Blog";
import Comment from "../models/Comment";

// DELETE USER
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.json({ success: true, message: "User deleted successfully" });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE PASSWORD
export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { userId, newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });
        res.json({ success: true, message: "Password updated successfully" });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// User-specific: Get all blogs by a user
export const getAllBlogsByUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req?.user?.id;
        const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
};

// User-specific: Get all comments on the user's blogs
export const getAllCommentsByUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req?.user?.id;
        // Find blogs by the user
        const userBlogs = await Blog.find({ author: userId }, "_id");
        const blogIds = userBlogs.map(blog => blog._id);
        // Get comments on those blogs
        const comments = await Comment.find({ blog: { $in: blogIds } })
            .populate("blog")
            .sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
};

// User-specific: Dashboard data
export const getDashboardByUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req?.user?.id;
        const recentBlogs = await Blog.find({ author: userId }).sort({ createdAt: -1 }).limit(5);
        const blogs = await Blog.countDocuments({ author: userId });
        const drafts = await Blog.countDocuments({ author: userId, isPublished: false });

        // Get comments on user's blogs
        const userBlogs = await Blog.find({ author: userId }, "_id");
        const blogIds = userBlogs.map(blog => blog._id);
        const comments = await Comment.countDocuments({ blog: { $in: blogIds } });

        const dashboardData = { blogs, recentBlogs, comments, drafts };
        res.json({ success: true, dashboardData });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
};
