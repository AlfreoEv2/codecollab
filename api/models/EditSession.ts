import mongoose, { Document, Schema } from 'mongoose';

import { ObjectId } from 'mongodb';

interface IEditOperation {
  fileId: ObjectId;
  type: 'insert' | 'delete' | 'modify';
  position: { line: number; column: number };
  content?: string;
  timestamp: Date;
}

interface IEditSession extends Document {
  project: ObjectId;
  participants: ObjectId[];
  startTime: Date;
  endTime?: Date;
  activeEdits: IEditOperation[];
}

const EditSessionSchema: Schema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  activeEdits: [{
    fileId: { type: Schema.Types.ObjectId, ref: 'File', required: true },
    type: { type: String, enum: ['insert', 'delete', 'modify'], required: true },
    position: { 
      line: { type: Number, required: true },
      column: { type: Number, required: true }
    },
    content: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
});

const EditSessionModel = mongoose.model<IEditSession>('EditSession', EditSessionSchema);

export default EditSessionModel;
