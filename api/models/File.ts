import mongoose, { Document, Schema } from 'mongoose';
import { ObjectId } from 'mongodb';

interface IFile extends Document {
  filename: string;
  content: string;
  project: ObjectId;
  creationDate: Date;
  lastModifiedDate: Date;
}

const FileSchema: Schema = new Schema({
  filename: { type: String, required: true },
  content: { type: String, required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  creationDate: { type: Date, default: Date.now },
  lastModifiedDate: { type: Date, default: Date.now },
});

const FileModel = mongoose.model<IFile>('File', FileSchema);

export default FileModel;