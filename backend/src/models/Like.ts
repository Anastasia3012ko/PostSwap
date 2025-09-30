import mongoose, { Document, Schema, Types, Model } from 'mongoose';

export interface ILike extends Document {
  user: Types.ObjectId;
  post: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const likeSchema: Schema<ILike> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true }
);

likeSchema.index({ user: 1, post: 1 }, { unique: true });

likeSchema.post<ILike>('save', async function (doc) {
  await mongoose.model('Post').updateOne(
    { _id: doc.post },
    { $inc: { likesCount: 1 } }
  );
});

likeSchema.post<ILike>('deleteOne', { document: true, query: false }, async function () {
  await mongoose.model('Post').updateOne(
    { _id: this.post },
    { $inc: { likesCount: -1 } }
  );
});

const Like: Model<ILike> = mongoose.model<ILike>('Like', likeSchema);

export default Like;