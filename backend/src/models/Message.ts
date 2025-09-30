import mongoose, { Document, Schema, Model } from "mongoose";

export interface IMessage extends Document {
  room: mongoose.Types.ObjectId; 
  sender: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}


const messageSchema: Schema<IMessage>= new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },   //Room = chat Id
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },  
  text: { type: String, required: true },    
  },
  { timestamps: true }
);

messageSchema.pre<IMessage>("save", function (next) {
  if (!this.room || !this.sender) {
    next(new Error("Message must have a room and a sender"));
  } else {
    next();
  }
});
const Message: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);

export default Message;