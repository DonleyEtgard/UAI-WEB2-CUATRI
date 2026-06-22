import { Schema, model, InferSchemaType } from "mongoose";

const saleItemSchema = new Schema(
  {
    sale: {
      type: Schema.Types.ObjectId,
      ref: "Sale",
      required: true
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    // 📦 Cantidad vendida
    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    // 💲 Precio unitario al momento de la venta
    price: {
      type: Number,
      required: true
    },

    // 💰 Subtotal (price * quantity)
    subtotal: {
      type: Number,
      required: true
    },

    // 🏷️ Nombre del producto (snapshot)
    productName: {
      type: String,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    ownerAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true
    }
  },
  {
    timestamps: true,
  }
);

type SaleItemType = InferSchemaType<typeof saleItemSchema>;

export default model<SaleItemType>("SaleItem", saleItemSchema);
