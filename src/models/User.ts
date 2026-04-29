import { Schema, model, InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
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
plan: {
  type: String,
  enum: ["free", "basic", "active", "suspended"],
  default: "free"
},

subscriptionStart: {
  type: Date
},

lastPaymentQR: {
  type: String
},

subscriptionEnd: {
  type: Date
},
subscriptionPaid: {
  type: Boolean,
  default: false
},
image: {
  type: String
},
    role: {
  type: String,
  enum: ["superadmin", "admin", "seller"],
  default: "seller"
},

    isActive: {
      type: Boolean,
      default: true
    },

    firebaseUid: {
      type: String,
      required: false,
      unique: true
    }
  },
  {
    timestamps: true,
  }
  
);

type UserType = InferSchemaType<typeof userSchema>;

const User = model<UserType>("User", userSchema);

export default User;