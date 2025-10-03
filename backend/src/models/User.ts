import mongoose, { Document, Schema, Types, Model } from 'mongoose';
import bcrypt from "bcrypt";
import { IImage } from './Image.js';
import { IPost } from './Post.js';
import Follow, { IFollow } from './Follow.js';

export interface IUser extends Document {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  about?: string;
  website?: string;
  avatar?: Types.ObjectId | IImage | null;

  postsCount: number;
  followersCount: number;
  followingCount: number;

  resetCode?: number;
  resetCodeExpires?: number;

  posts?: (IPost & Document)[]; // virtual
  followers?: (IFollow & Document)[]; // virtual
  following?: (IFollow & Document)[]; // virtual
}

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true
    },
    about: {
      type: String,
      default: '',
      maxLength: [150, 'Description cannot exceed 150 characters'],
    },
    website: {
      type: String,
      default: '',
    },
    avatar: { type: Schema.Types.ObjectId, ref: 'Image', default: null },

    postsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },

    resetCode: { type: Number },
    resetCodeExpires: { type: Number },
  },
  { timestamps: true,
    toJSON: { virtuals: true },  
    toObject: { virtuals: true }, }
);

// virtual  field posts by user
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

// followers
// All Follow-doc, where Follow.following = User._id

userSchema.virtual('followers', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'following',
  justOne: false,
});

// following
// all Follow-doc, where Follow.follower = User._i

userSchema.virtual('following', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'follower',
  justOne: false,
});

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetCode;
  delete obj.resetCodeExpires;
  return obj;
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;