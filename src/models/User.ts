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
  enum: ["free", "basic", "medium", "premium"],
  default: "free"
},
subscriptionStatus: {
  type: String,
  enum: [
    "active",
    "expired",
    "pending",
    "suspended"
  ],
  default: "expired"
},
lastPaymentMethod: {
  type: String,
  enum: [
  "cash",
  "transfer",
  "moncash",
  "mercado pago"
]
},
subscriptionStart: {
  type: Date
},

lastPaymentAmount: {
  type: Number,
  default: 0
},

lastPaymentDate: {
  type: Date
},
trialUsed: {
  type: Boolean,
  default: false
},

trialEnd: {
  type: Date
},
 // 📍 DIRECCIÓN (🔥 NUEVO)
    address: {
      street: { type: String },
      number: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String, default: "Argentina" },
      postalCode: { type: String }
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
  enum: ["superadmin", "admin", "employee", "user"],
  default: "user"
},

    isVerified: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
    },

    firebaseUid: {
      type: String,
      required: false,
      unique: true
    },
    createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
  },
  {
    timestamps: true,
  }
  
);

type UserType = InferSchemaType<typeof userSchema>;

const User = model<UserType>("User", userSchema);

export default User;