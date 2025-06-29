import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { deleteUser, updatePassword } from "../controllers/userController";
import { authenticateJWT } from "../middleware/auth";
import { approveCommentbyId, deleteCommentbyId, getAllBllogsAdmin, getAllCommentsAdmin, getDashboard } from "../controllers/adminController";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.delete("/delete/:id", authenticateJWT, deleteUser);
userRouter.put("/update-password", authenticateJWT, updatePassword);

userRouter.get('/blogs', authenticateJWT, getAllBllogsAdmin);
userRouter.get('/comments', authenticateJWT, getAllCommentsAdmin);
userRouter.post('/delete-comment/:id', authenticateJWT, deleteCommentbyId);
userRouter.post('/approve-comment/:id', authenticateJWT, approveCommentbyId);
userRouter.get('/dashboard', authenticateJWT, getDashboard);

export default userRouter;