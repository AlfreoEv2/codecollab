import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  creationDate: Date;
}

const UserSchema: Schema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
