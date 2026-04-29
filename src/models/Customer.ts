import { Schema, model, InferSchemaType } from "mongoose";

const customerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },

  // 🔥 CLAVE PARA MULTI-USUARIO
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  isActive: { type: Boolean, default: true }

}, { timestamps: true });

type CustomerType = InferSchemaType<typeof customerSchema>;

export default model<CustomerType>("Customer", customerSchema);