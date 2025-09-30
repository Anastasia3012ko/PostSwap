import mongoose, { Document, Schema, Types, Model } from 'mongoose';
import User, { IUser } from './User.js';
import { IImage } from './Image.js';

export interface IPost extends Document {
  user: Types.ObjectId | IUser;
  photo: Types.ObjectId | IImage; 
  description?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema: Schema<IPost> = new Schema<IPost>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    photo: {
      type: Schema.Types.ObjectId,
      ref: 'Image',
      required: true,
    },
    description: {
      type: String,
      default: '',
      maxLength: [1000, 'Description cannot exceed 1000 characters'],
    },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.post<IPost>('save', async function () {
  try {
    if (this.isNew) {
      await User.updateOne(
        { _id: this.user },
        { $inc: { postsCount: 1 } }
      ).exec();
    }
  } catch (error) {
    
      console.error('Error incrementing postsCount:', 
        error instanceof Error ? error.message : error
      );
  }
});

postSchema.post<IPost>('deleteOne', { document: true, query: false }, async function () {
  try {
    const doc = this as IPost;
    await User.updateOne({ _id: doc.user }, { $inc: { postsCount: -1 } }).exec();
  } catch (error) {
    console.error(
      "Error decrementing postsCount:",
      error instanceof Error ? error.message : error
    );
  }
});

postSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'post',
  justOne: false,
});

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  justOne: false,
});

const Post: Model<IPost> = mongoose.model<IPost>('Post', postSchema);

export default Post;
