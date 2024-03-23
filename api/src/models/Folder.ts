import mongoose, { Document, Schema } from "mongoose";
import { ObjectId } from "mongodb";

interface IFolder extends Document {
  folderName: string;
  project: ObjectId;
  parentFolder?: ObjectId;
  files: ObjectId[];
  subFolders: ObjectId[];
  creationDate: Date;
  lastModifiedDate: Date;
}

const FolderSchema: Schema = new Schema({
  folderName: { type: String, required: true },
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  parentFolder: { type: Schema.Types.ObjectId, ref: "Folder" },
  files: [{ type: Schema.Types.ObjectId, ref: "File" }],
  subFolders: [{ type: Schema.Types.ObjectId, ref: "Folder" }],
  creationDate: { type: Date, default: Date.now },
  lastModifiedDate: { type: Date, default: Date.now },
});

const FolderModel = mongoose.model<IFolder>("Folder", FolderSchema);

export default FolderModel;
