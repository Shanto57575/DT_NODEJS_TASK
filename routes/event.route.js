import express from "express";
import upload from "../middleware/upload.js";
import {
    createEvent,
    deleteEvent,
    getEventById,
    getLatestEvents,
    updateEvent
} from "../controllers/event.controller.js";

const eventRouter = express.Router();

eventRouter.get("/events", (req, res, next) => {
    if (req.query.type === "latest") {
        return getLatestEvents(req, res, next);
    }
    return getEventById(req, res, next);
});

eventRouter.post("/events", upload.single("files"), createEvent);

eventRouter.put("/events/:id", upload.single("files"), updateEvent);

eventRouter.delete("/events/:id", deleteEvent);

export default eventRouter;
