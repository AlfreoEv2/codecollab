import mongoose, { Document, Schema } from "mongoose";
import { ObjectId } from "mongodb";

interface IProject extends Document {
  projectName: string;
  owner: ObjectId;
  collaborators: ObjectId[];
  creationDate: Date;
  lastModifiedDate: Date;
  language: string;
  rootFolder?: ObjectId;
}

const ProjectSchema: Schema = new Schema({
  projectName: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
  creationDate: { type: Date, default: Date.now },
  lastModifiedDate: { type: Date, default: Date.now },
  language: { type: String, required: true },
  rootFolder: { type: Schema.Types.ObjectId, ref: "Folder" },
});

const ProjectModel = mongoose.model<IProject>("Project", ProjectSchema);

export default ProjectModel;
