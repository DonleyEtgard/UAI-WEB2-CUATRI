import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  method: {
    type: String,
    enum: ["cash", "transfer", "moncash"],
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },

  qrData: String,

  reference: String // id externo o comprobante
}, { timestamps: true });

export default model("Payment", paymentSchema);