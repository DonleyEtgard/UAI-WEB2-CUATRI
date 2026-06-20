import { Schema, model, InferSchemaType } from "mongoose";

const saleSchema = new Schema(
  {
    // 🧑 Cliente (opcional en kiosco)
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: false
    },

    // 👤 Usuario que vende
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 💰 Total calculado en backend
    total: {
      type: Number,
      required: true,
      min: 0
    },

  totalCost: {
      type: Number,
      default: 0,
      min: 0
     },

    profit: {
       type: Number,
       default: 0
      },

    // 💳 Método de pago
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer", "moncash", "mercado-pago"],
      required: true
    },
    currency: {
      type: String,
      enum: ["HTG", "$ ARG"],
      default: "$ ARG"
   },
   amountPaid: {
  type: Number,
  default: 0
},

change: {
  type: Number,
  default: 0
},

    // 📊 Estado
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending"
    },

    // 📝 Notas opcionales
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// 👉 Índices útiles (performance 🚀)
saleSchema.index({ createdAt: -1 });
saleSchema.index({ status: 1 });
saleSchema.index({ paymentMethod: 1 });

type SaleType = InferSchemaType<typeof saleSchema>;

export default model<SaleType>("Sale", saleSchema);