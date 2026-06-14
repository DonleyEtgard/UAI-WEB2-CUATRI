import { Schema, model, InferSchemaType } from "mongoose";

const stockMovementSchema = new Schema(
  {
    // 📦 Producto afectado
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    // 🔄 Tipo de movimiento
    type: {
      type: String,
      enum: ["in", "out"],
      required: true
    },

    // 🔢 Cantidad movida
    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    // 🧾 Referencia a venta (si aplica)
    sale: {
      type: Schema.Types.ObjectId,
      ref: "Sale"
    },

    // 👤 Usuario que hizo el cambio
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 📝 Motivo del movimiento
    reason: {
      type: String,
       enum: [
        "sale",
        "restock",
        "adjustment",
        "initial_stock"
        ],
      required: true
    },

    // 📊 Stock después del movimiento
    stockAfter: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

type StockMovementType = InferSchemaType<typeof stockMovementSchema>;

export default model<StockMovementType>("StockMovement", stockMovementSchema);