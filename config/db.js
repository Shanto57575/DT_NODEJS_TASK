import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let dbInstance = null;

const connectDB = async () => {
    if (dbInstance) {
        console.log("🔄 Using existing database connection");
        return dbInstance;
    }

    try {
        await client.connect();
        console.log("✅ MongoDB Connected Successfully!");
        dbInstance = client.db("eventDB");
        return dbInstance;
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

export default connectDB;
