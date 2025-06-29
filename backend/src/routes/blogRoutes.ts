import express from "express";
import { authenticateJWT } from "../middleware/auth";
import upload from "../middleware/multer";
import { addBlog, addComment, deleteBlogById, generateContent, getAllBllogs, getBlogById, getBlogComments, subscribeUser, togglePublish } from "../controllers/blogController";

const blogRouter = express.Router();

blogRouter.post('/add-blog', upload.single('image'), authenticateJWT, addBlog);
blogRouter.get('/all', getAllBllogs);
blogRouter.get('/:blogId', getBlogById);
blogRouter.post('/delete/:blogId', authenticateJWT, deleteBlogById);
blogRouter.post('/toggle-publish/:blogId', authenticateJWT, togglePublish);

blogRouter.post('/add-comment', addComment);
blogRouter.get('/comments/:blogId', getBlogComments);

blogRouter.post('/generate', authenticateJWT, generateContent);
blogRouter.post('/subscribe', subscribeUser);
export default blogRouter;
