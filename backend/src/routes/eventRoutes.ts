import express from "express";
import { createEventController, getAllEventsController, updateEventController } from "../controllers/eventController";

const eventRouter = express.Router();
eventRouter.post('/create-event', createEventController);
eventRouter.get('/all', getAllEventsController);
eventRouter.post('/update-event', updateEventController);

export default eventRouter;
