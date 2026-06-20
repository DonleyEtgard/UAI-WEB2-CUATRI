import { Schema, model, InferSchemaType } from "mongoose";

const paymentSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }

}, { _id: false });

const customerSchema = new Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String
  },

  phone: {
    type: String
  },
address: {
  type: String,
  default: ""
},
  // 🔥 MULTI-USUARIO
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 💰 DEUDA TOTAL
  debt: {
    type: Number,
    default: 0
  },

  // 📅 HISTORIAL DE PAGOS
  payments: [paymentSchema],

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

type CustomerType = InferSchemaType<typeof customerSchema>;

export default model<CustomerType>("Customer", customerSchema);