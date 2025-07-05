import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { deleteUser, getAllBlogsByUser, getAllCommentsByUser, getDashboardByUser, updatePassword } from "../controllers/userController";
import { authenticateJWT } from "../middleware/auth";
import { approveCommentbyId, deleteCommentbyId } from "../controllers/adminController";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.delete("/delete/:id", authenticateJWT, deleteUser);
userRouter.put("/update-password", authenticateJWT, updatePassword);

userRouter.get('/blogs', authenticateJWT, getAllBlogsByUser);
userRouter.get('/comments', authenticateJWT, getAllCommentsByUser);
userRouter.post('/delete-comment/:id', authenticateJWT, deleteCommentbyId);
userRouter.post('/approve-comment/:id', authenticateJWT, approveCommentbyId);
userRouter.get('/dashboard', authenticateJWT, getDashboardByUser);

export default userRouter;