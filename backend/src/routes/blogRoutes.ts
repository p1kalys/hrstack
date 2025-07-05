import express from "express";
import { authenticateJWT } from "../middleware/auth";
import upload from "../middleware/multer";
import { addBlog, addComment, deleteBlogById, fetchExternalBlogs, generateContent, getAllBlogs, getBlogById, getBlogComments, subscribeUser, togglePublish } from "../controllers/blogController";

const blogRouter = express.Router();
blogRouter.get('/rss', fetchExternalBlogs);
blogRouter.post('/add-blog', upload.single('image'), authenticateJWT, addBlog);
blogRouter.get('/all', getAllBlogs);
blogRouter.get('/:blogId', getBlogById);
blogRouter.post('/delete/:blogId', authenticateJWT, deleteBlogById);
blogRouter.post('/toggle-publish/:blogId', authenticateJWT, togglePublish);

blogRouter.post('/add-comment', addComment);
blogRouter.get('/comments/:blogId', getBlogComments);

blogRouter.post('/generate', authenticateJWT, generateContent);
blogRouter.post('/subscribe', subscribeUser);

export default blogRouter;
