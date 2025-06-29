import fs from 'fs';
import { Request, Response } from 'express';
import imagekit from '../config/imagekit';
import Blog from '../models/Blog';
import { AuthenticatedRequest } from '../middleware/auth';
import Comment from '../models/Comment';
import main from '../config/gemini';
import Subscriber from '../models/Subscriber';

export const addBlog = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized: User info missing." });
        }
        const { title, subTitle, description, category, isPublished, anonymous } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        if (!title || !description || !category || !imageFile) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs",
        });

        fs.unlinkSync(imageFile.path);

        const optimizedImageURL = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: 'auto' },
                { format: 'webp' },
                { width: '1280' },
            ],
        });

        const blog = await Blog.create({
            title,
            subTitle,
            description,
            category,
            image: optimizedImageURL,
            isPublished,
            anonymous,
            author: req.user.id
        });

        res.json({ success: true, message: 'Blog added successfully', blog });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllBllogs = async (req: Request, res: Response) => {
    try {
        const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (error: any) {
        res.json({ success: false, message: error.message })
    }
}

export const getBlogById = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId).populate("author", "name email");
        if (!blog) {
            return res.json({ success: false, message: 'Blog not found' });
        }
        res.json({ success: true, blog });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const deleteBlogById = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;
        await Blog.findByIdAndDelete(blogId);
        await Comment.deleteMany({ blog: blogId });
        res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const togglePublish = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.json({ success: false, message: 'Blog not found' });
        }
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({ success: true, message: 'Blog status updated' })
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const addComment = async (req: Request, res: Response) => {
    try {
        const { blog, name, content } = req.body;
        await Comment.create({ blog, name, content, isApproved: true });
        res.json({ success: true, message: 'Comment added for review' })
    } catch (error: any) {
        res.json({ success: false, message: error.message });
    }
}

export const getBlogComments = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;
        const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error: any) {
        res.json({ success: false, message: error.message })
    }
}

export const generateContent = async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body;
        const content = await main("You're an expert blog writer with over 10 years of experience in crafting high-performing content. Write a complete blog post on the topic: " + prompt + "Your goal is to - Hook the reader from the first sentence. Sound confident, insightful, and authoritative — like a seasoned industry author. Include deep insights, storytelling, analogies, or relevant examples that elevate the piece. Break it into clear sections (intro, body, conclusion) with engaging subheadings. Use active voice, punchy sentences, and occasional rhetorical flair. End with a strong takeaway or a subtle call to action that leaves the reader inspired or thoughtful. Write in a tone that is professional yet human — polished but not robotic. Proceed to write the blog now.")
        res.json({ success: true, message: content })
    } catch (error: any) {
        res.json({ success: false, message: error.message })
    }
}

export const subscribeUser = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email || !email.includes('@')) {
            return res.status(400).json({ success: false, message: 'Invalid email' });
        }

        const existing = await Subscriber.findOne({ email });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already subscribed' });
        }

        await Subscriber.create({ email });
        res.json({ success: true, message: 'Subscribed successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}