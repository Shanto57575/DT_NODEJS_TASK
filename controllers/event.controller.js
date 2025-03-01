import { ObjectId } from "mongodb";
import cloudinary from "../config/cloudinary.js";

const getEventById = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: "Event ID is required" });
        }

        const event = await db.collection("events").findOne({ _id: ObjectId.createFromHexString(id) });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getLatestEvents = async (req, res) => {
    try {
        const db = req.app.locals.db;
        let { limit = 5, page = 1, type } = req.query;

        if (type !== "latest") {
            return res.status(400).json({ message: "Invalid type parameter" });
        }

        limit = parseInt(limit);
        page = parseInt(page);

        if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
            return res.status(400).json({ message: "Limit and page must be positive numbers" });
        }

        const events = await db.collection("events")
            .find({})
            .sort({ schedule: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching latest events:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const createEvent = async (req, res) => {
    try {
        const db = req.app.locals.db;
        if (!db) {
            return res.status(500).json({ message: "Database connection not established" });
        }

        const { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank, attendees } = req.body;

        if (!name || !tagline || !schedule || !description || !moderator || !category || !sub_category || rigor_rank === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const eventDate = new Date(schedule);
        if (isNaN(eventDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format for schedule" });
        }

        const imageUrl = req.file ? req.file.path : null;

        const newEvent = {
            type: "event",
            uid: 18, // assuming
            name,
            tagline,
            schedule: eventDate,
            description,
            files: imageUrl,
            moderator,
            category,
            sub_category,
            rigor_rank: parseInt(rigor_rank),
            attendees: Array.isArray(attendees) ? attendees.map(id => ObjectId.createFromHexString(id)) : [],
        };

        const result = await db.collection("events").insertOne(newEvent);

        res.status(201).json({ message: "Event created successfully", eventId: result.insertedId });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const updateEvent = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid event ID" });
        }

        const updatedEvent = {};
        const fields = ["name", "tagline", "schedule", "description", "moderator", "category", "sub_category", "rigor_rank"];

        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                updatedEvent[field] = field === "schedule" ? new Date(req.body[field]) : req.body[field];
            }
        });

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "event_images" });
            updatedEvent.files = result.secure_url;
        }

        if (updatedEvent.rigor_rank) {
            updatedEvent.rigor_rank = parseInt(updatedEvent.rigor_rank);
        }

        const result = await db.collection("events").updateOne(
            { _id: ObjectId.createFromHexString(id) },
            { $set: updatedEvent }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event updated successfully", updatedEvent });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid event ID" });
        }

        const result = await db.collection("events").deleteOne({ _id: ObjectId.createFromHexString(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export {
    getEventById,
    getLatestEvents,
    createEvent,
    updateEvent,
    deleteEvent
}