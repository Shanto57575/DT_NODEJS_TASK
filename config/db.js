import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const connectDB = async () => {
    try {
        await client.connect();
        console.log("✅ MongoDB Connected Successfully!");
        return client.db("eventDB");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

export default connectDB;
