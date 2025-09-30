import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IChat extends Document {
  participants: Types.ObjectId[]; 
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema: Schema<IChat> = new Schema<IChat>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: 'User', required: true } // userId  users in chat
    ],
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


chatSchema.index({ participants: 1 }, { unique: true });

const Chat: Model<IChat> = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;