import mongoose, { Document, Schema, Model } from 'mongoose';
import { IUser } from './User';

export interface IImage extends Document {
  filename: string;
  url: string;
  folder: string;
  user: mongoose.Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema: Schema<IImage> = new Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true }, // link in  S3
  folder: { type: String, default: "posts" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //  (user id) 
 },
 {timestamps: true}
);

const Image: Model<IImage> = mongoose.model<IImage>("Image", imageSchema);

export default Image;