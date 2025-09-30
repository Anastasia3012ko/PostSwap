import mongoose, {Schema, Document, Types, Model} from 'mongoose';

export interface IComment extends Document {
  post: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema: Schema<IComment> = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, maxLength: [200, 'Comment cannot exceed 200 characters'] },
  },
  { timestamps: true }
);


commentSchema.post<IComment>('save', async function () {
  await mongoose.model('Post').updateOne({ _id: this.post }, { $inc: { commentsCount: 1 } });
});

commentSchema.post<IComment>('deleteOne', { document: true, query: false }, async function () {
  await mongoose.model('Post').updateOne({ _id: this.post }, { $inc: { commentsCount: -1 } });
});

const Comment: Model<IComment> = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;