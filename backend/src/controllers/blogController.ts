import fs from 'fs';
import { Request, Response } from 'express';
import imagekit from '../config/imagekit';
import Blog from '../models/Blog';
import { AuthenticatedRequest } from '../middleware/auth';
import Comment from '../models/Comment';
import main from '../config/gemini';
import Subscriber from '../models/Subscriber';
import Parser from 'rss-parser';

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

export const getAllBlogs = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string || '').trim().toLowerCase();
        const category = req.query.category as string;
        const filtersApplied = !!search || (category && category !== 'All');
        const queryFilter: any = {
            isPublished: true
        };

        if (filtersApplied) {
            queryFilter.isFromRss = { $ne: true };

            const andConditions: any[] = [];

            if (search) {
                andConditions.push({
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
                });
            }

            if (category && category !== 'All') {
                andConditions.push({
                    category: { $elemMatch: { $regex: category, $options: 'i' } }
                });
            }

            if (andConditions.length > 0) {
                queryFilter.$and = andConditions;
            }
        }

        const skip = (page - 1) * limit;

        const total = await Blog.countDocuments(queryFilter);

        // Fetch paginated blogs
        const blogs = await Blog.find(queryFilter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            blogs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
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

export const fetchExternalBlogs = async (req: Request, res: Response) => {
    try {
        const parser = new Parser();
        const urls = [
            'https://hr.economictimes.indiatimes.com/rss/topstories',
            'https://hr.economictimes.indiatimes.com/rss/workplace-4-0/talent-management',
            'https://hr.economictimes.indiatimes.com/rss/hrtech',
            'https://www.hrdive.com/feeds/news/'
        ];

        const feedPromises = urls.map(url => parser.parseURL(url));
        const feeds = await Promise.all(feedPromises);

        const combinedItems = feeds.flatMap(feed => feed.items);

        combinedItems.sort((a, b) =>
            new Date(b.isoDate || '').getTime() - new Date(a.isoDate || '').getTime()
        );

        res.json({ success: true, feed: { items: combinedItems } });
    } catch (error: any) {
        console.error('RSS feed fetch failed:', error);
        res.json({ success: false, message: error.message });
    }
};
