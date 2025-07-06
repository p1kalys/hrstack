import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { deleteUser, updatePassword } from "../controllers/userController";
import { authenticateJWT } from "../middleware/auth";
import { approveCommentbyId, approveEventbyId, approveJobbyId, deleteCommentbyId, deleteEventbyId, deleteJobbyId, getAllBlogsAdmin, getAllCommentsAdmin, getAllEventsAdmin, getAllJobsAdmin, getDashboardAdmin } from "../controllers/adminController";

const adminRouter = express.Router();

adminRouter.post("/register", registerUser);
adminRouter.post("/login", loginUser);
adminRouter.delete("/delete/:id", authenticateJWT, deleteUser);
adminRouter.put("/update-password", authenticateJWT, updatePassword);

adminRouter.get('/blogs', authenticateJWT, getAllBlogsAdmin);
adminRouter.get('/comments', authenticateJWT, getAllCommentsAdmin);
adminRouter.post('/delete-comment/:id', authenticateJWT, deleteCommentbyId);
adminRouter.post('/approve-comment/:id', authenticateJWT, approveCommentbyId);
adminRouter.get('/dashboard', authenticateJWT, getDashboardAdmin);
adminRouter.post('/approve-event/:id', authenticateJWT, approveEventbyId);
adminRouter.post('/delete-event/:id', authenticateJWT, deleteEventbyId);
adminRouter.get('/events', authenticateJWT, getAllEventsAdmin);
adminRouter.post('/approve-job/:id', authenticateJWT, approveJobbyId);
adminRouter.post('/delete-job/:id', authenticateJWT, deleteJobbyId);
adminRouter.get('/jobs', authenticateJWT, getAllJobsAdmin);

export default adminRouter;