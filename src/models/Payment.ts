import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  plan: {
    type: String,
    enum: ["basic", "medium", "premium"],
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  method: {
    type: String,
    enum: ["cash", "card", "transfer", "moncash", "mercado-pago"],
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },

  qrData: String,

  reference: String
}, { timestamps: true });

export default model("Payment", paymentSchema);