import mongoose, {Schema, Document, Types, Model} from 'mongoose';
import User from './User.js';

export interface IFollow extends Document {
   follower: Types.ObjectId;
   following: Types.ObjectId;
   createdAt: Date;
}


const followSchema: Schema<IFollow> = new mongoose.Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// unique index, impossible to subscribe twice
followSchema.index({ follower: 1, following: 1 }, { unique: true });

followSchema.pre<IFollow>('save', function (next) {
  if (this.follower.equals(this.following)) {
    return next(new Error('You cannot subscribe to yourself'));
  }
  next();
});

followSchema.post<IFollow>('save', async function (doc) {
  const User = mongoose.model('User');
  await User.updateOne({ _id: doc.follower }, { $inc: { followingCount: 1 } });
  await User.updateOne({ _id: doc.following }, { $inc: { followersCount: 1 } });
});

followSchema.post<IFollow>('deleteOne', { document: true, query: false }, async function () {
  await User.updateOne({ _id: this.follower }, { $inc: { followingCount: -1 } });
  await User.updateOne(
    { _id: this.following },
    { $inc: { followersCount: -1 } }
  );
});



const Follow: Model<IFollow> = mongoose.model<IFollow>('Follow', followSchema);

export default Follow;
