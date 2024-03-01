import mongoose, { Document, Schema } from 'mongoose';
import { ObjectId } from 'mongodb';

interface IComment extends Document {
  content: string;
  file: ObjectId;
  author: ObjectId;
  lineReference: number;
  creationDate: Date;
}

const CommentSchema: Schema = new Schema({
  content: { type: String, required: true },
  file: { type: Schema.Types.ObjectId, ref: 'File', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lineReference: { type: Number, required: true },
  creationDate: { type: Date, default: Date.now },
});

const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);

export default CommentModel;