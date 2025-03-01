import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import connectDB from './config/db.js';
import eventRouter from './routes/event.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
    try {
        const db = await connectDB();
        app.locals.db = db;
        app.use("/api/v3/app", eventRouter);

        app.get('/', (req, res) => {
            res.send({ "message": 'Hello From Event API' });
        });

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } catch (error) {
        console.error("❌ Failed to start the server:", error);
    }
};

startServer();
