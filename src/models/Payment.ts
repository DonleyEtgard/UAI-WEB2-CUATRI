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
  currency: {
    type: String,
    enum: ["ARS", "HTG"],
    required: true,
    default: "ARS"
  },
  method: {
    type: String,
    enum: [
      "cash",
      "card",
      "transfer",
      "moncash",
      "mercadopago"
    ],
    required: true
  },
  
  status: {
  type: String,
  enum: [
    "pending",
    "pending_verification",
    "paid",
    "failed",
    "cancelled",
    "refunded"
  ],
  default: "pending"
},

  transactionId: String,

  externalReference: String,

  qrData: String,

  reference: String,

  receiptImage: String,

  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  approvedAt: Date,

  providerResponse: {
    type: Schema.Types.Mixed
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  ownerAdmin: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true
  }, 
  provider: {
  type: String,
  enum: ["mercadopago", "moncash"],
  required: true
},

providerStatus: {
  type: String,
  default: "pending"
},

initPoint: String, // Mercado Pago URL
qrImage: String,   // MonCash QR o imagen

}, {
  timestamps: true
});

export default model(
  "Payment",
  paymentSchema
);