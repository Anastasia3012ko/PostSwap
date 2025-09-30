import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URL: string = process.env.MONGO_URL || ''

async function connectToDatabase(): Promise<void> {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected successfully to MongoDB Atlas");

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Failed to connect to MongoDB:", error.message);
        } else {
            console.error("Failed to connect to MongoDB: unknown error", error);
        }
    }
}


export default connectToDatabase;
