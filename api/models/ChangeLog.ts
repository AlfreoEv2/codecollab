import mongoose, { Document, Schema } from 'mongoose';
import { ObjectId } from 'mongodb';

interface IChangeLog extends Document {
  file: ObjectId;
  timestamp: Date;
  changes: string;
  author: ObjectId;
}

const ChangeLogSchema: Schema = new Schema({
  file: { type: Schema.Types.ObjectId, ref: 'File', required: true },
  timestamp: { type: Date, default: Date.now },
  changes: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const ChangeLogModel = mongoose.model<IChangeLog>('ChangeLog', ChangeLogSchema);

export default ChangeLogModel;