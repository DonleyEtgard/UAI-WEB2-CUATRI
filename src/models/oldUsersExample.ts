import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  lastName: string;
  email: string;
  isActive: boolean;
}

const userSchema = new Schema<IUser>({
    name: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model<IUser>("User", userSchema);


export default User;