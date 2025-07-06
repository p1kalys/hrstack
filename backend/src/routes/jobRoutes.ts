import express from "express";
import { createJobController, getAllJobsController, updateJobController } from "../controllers/jobController";
import upload from "../middleware/multer";

const jobRouter = express.Router();
jobRouter.post('/create-job', upload.single('image'), createJobController);
jobRouter.get('/all', getAllJobsController);
jobRouter.post('/update-job', updateJobController);

export default jobRouter;
