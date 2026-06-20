import { Schema, model, InferSchemaType } from "mongoose";

const productSchema = new Schema(
  {
    // 🏷️ Nombre del producto
    name: {
      type: String,
      required: true,
      trim: true
    },

    user: {
       type: Schema.Types.ObjectId,
       ref: "User",
       required: true
         },
    // 💲 Precio de venta
    price: {
      type: Number,
      required: true,
      min: 0
    },

    // 💰 Costo (para calcular ganancia)
    cost: {
      type: Number,
      required: true,
      min: 0
    },

    // 📦 Stock disponible
    stock: {
      type: Number,
      required: true,
      min: 0
    },

    // 📝 Descripción opcional
    description: {
      type: String
    },
images: {
  type: [String],
  default: []
},
    // 🏷️ Categoría (opcional)
    category: {
      type: String
    },

    // 🔄 Estado activo/inactivo
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

type ProductType = InferSchemaType<typeof productSchema>;

const Product = model<ProductType>("Product", productSchema);

export default Product;
