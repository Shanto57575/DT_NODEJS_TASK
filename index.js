import express from 'express';
import dotenv from 'dotenv'
import cors from "cors";
import connectDB from './config/db.js';

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
// app.use("/api/v3/app", eventRoutes);

app.get('/', (req, res) => {
    res.send({ "message": 'Hello From Event API' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDB()
});