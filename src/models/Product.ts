// src/models/Product.ts
import { Schema, model, InferSchemaType } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

type ProductType = InferSchemaType<typeof productSchema>;

const Product = model<ProductType>("Product", productSchema);

export default Product;
