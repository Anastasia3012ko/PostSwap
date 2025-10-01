import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URL: string = process.env.MONGO_URL || '';

async function connectToDatabase(): Promise<void> {
  try {
    if (!MONGO_URL) {
      throw new Error('MONGO_URL is not defined in environment variables');
    }
    await mongoose.connect(MONGO_URL);
    console.log('Connected successfully to MongoDB Atlas');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed to connect to MongoDB:', error.message);
      throw error; // пробрасываем ошибку
    } else {
      console.error('Failed to connect to MongoDB: unknown error', error);
      throw new Error('Unknown error connecting to MongoDB');
    }
  }
}

export default connectToDatabase;
