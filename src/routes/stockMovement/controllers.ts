import { Request, Response } from "express";
import StockMovement from "../../models/StockMovement";
import Product from "../../models/Product";
import SaleItem from "../../models/SaleItem";
import User from "../../models/User";
import type { AuthRequest } from "../../types/auth";
import Joi from "joi";



export const getOrganizationScope = (req: AuthRequest) => {
  if (!req.dbUser) {
    return { ownerAdmin: null };
  }

  if (req.dbUser.role === "superadmin") {
    return {};
  }

  return {
    ownerAdmin:
      req.dbUser.ownerAdmin ||
      req.dbUser._id,
  };
};

// 📌 Crear producto
export const handleCreateProduct = [
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, price, cost, stock, category } = req.body;
      const imageFiles = req.files as Express.Multer.File[];
      const images = imageFiles.map((file) => `/uploads/products/${file.filename}`);

      const product = await Product.create({
        name,
        price,
        cost,
        stock,
        category,
        images, // Guardar las rutas de las imágenes
        createdBy: req.dbUser?._id,
        ownerAdmin: req.dbUser?.ownerAdmin || req.dbUser?._id,
        isActive: true,
      });

      // ✅ Registrar movimiento inicial
      if (stock > 0) {
        await StockMovement.create({
          product: product._id,
          type: "in",
          quantity: stock,
          user: req.dbUser?._id,
          reason: "initial_stock",
          stockAfter: stock,
          createdBy: req.dbUser?._id,
          ownerAdmin: req.dbUser?.ownerAdmin || req.dbUser?._id,
        });
      }
      res.status(201).json(product);
    } catch (error: any) {
      res.status(500).json({
        message: "Error creating product",
        error: error.message,
      });
    }
  },
];

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      price,
      cost,
      stock,
      category,
      user
    } = req.body;

    const product = await Product.create({
  name,
  price,
  cost,
  stock,
  category,

  createdBy: req.dbUser?._id,
  ownerAdmin:
    req.dbUser?.ownerAdmin ||
    req.dbUser?._id,

  isActive: true
});

    // ✅ Registrar movimiento inicial
    if (stock > 0) {
     await StockMovement.create({
  product: product._id,
  type: "in",
  quantity: stock,

  user: req.dbUser?._id,

  reason: "initial_stock",
  stockAfter: stock,

  createdBy: req.dbUser?._id,
  ownerAdmin:
    req.dbUser?.ownerAdmin ||
    req.dbUser?._id
});
    }
    res.status(201).json(product);

  } catch (error: any) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message
    });
  }
};
// 📌 Actualizar producto
export const handleUpdateProduct = [
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { imageUrls, ...productData } = req.body;
      const imageFiles = (req.files as Express.Multer.File[]) || [];
      const newImages = imageFiles.map((file) => `/uploads/products/${file.filename}`);

      // Combina las imágenes existentes (si las hay) con las nuevas
      let existingImages: string[] = [];
      if (imageUrls) {
        try {
          existingImages = Array.isArray(imageUrls) ? imageUrls : JSON.parse(imageUrls);
        } catch (e) {
          existingImages = imageUrls.split(',').map((i: string) => i.trim()).filter(Boolean);
        }
      }

      const allImages = [...existingImages, ...newImages];

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { ...productData, images: allImages },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(updatedProduct);
    } catch (error: any) {
      res.status(500).json({
        message: "Error updating product",
        error: error.message,
      });
    }
  },
];
export const updateProduct = handleUpdateProduct;
// 📌 Actualizar stock manualmente
export const updateProductStock = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      quantity,
      type,
      user,
      reason
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    let newStock = product.stock;

    if (type === "in") {
      newStock += quantity;
    }

    if (type === "out") {
      if (product.stock < quantity) {
        return res.status(400).json({
          message: "Not enough stock"
        });
      }

      newStock -= quantity;
    }

    product.stock = newStock;

    await product.save();

    // ✅ Registrar movimiento
   await StockMovement.create({
     product: product._id,
     type,
      quantity,

     user: req.dbUser?._id,

     reason,
     stockAfter: newStock,

  createdBy: req.dbUser?._id,
  ownerAdmin:
    req.dbUser?.ownerAdmin ||
    req.dbUser?._id
});

    res.json(product);

  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};

// 📌 Crear movimiento manual de stock
export const createStockMovement = async (req: AuthRequest, res: Response) => {
  try {
    const { product, type, quantity, user, reason } = req.body;

    if (!product || !type || !quantity || !user || !reason) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const existingProduct = await Product.findById(product);

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    let newStock = existingProduct.stock;

    if (type === "in") {
      newStock += quantity;
    } else if (type === "out") {
      if (existingProduct.stock < quantity) {
        return res.status(400).json({
          message: "Not enough stock"
        });
      }
      newStock -= quantity;
    }

    const movement = await StockMovement.create({
    product,
    type,
    quantity,

    user: req.dbUser?._id,

    reason,
    stockAfter: newStock,

    createdBy: req.dbUser?._id,
    ownerAdmin:
    req.dbUser?.ownerAdmin ||
    req.dbUser?._id
});

existingProduct.stock = newStock;
await existingProduct.save();

res.status(201).json(movement);

    existingProduct.stock = newStock;
    await existingProduct.save();

    res.status(201).json(movement);

  } catch (error: any) {
    res.status(500).json({
      message: "Error creating stock movement",
      error: error.message
    });
  }
};



// 📌 Obtener todos los movimientos
export const getStockMovements = async (_req: Request, res: Response) => {
  try {
    const movements = await StockMovement.find()
      .populate("product")
      .populate("user")
      .populate("sale")
      .sort({ createdAt: -1 });

    res.json(movements);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// 📌 Movimientos por producto
export const getMovementsByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const movements = await StockMovement.find({ product: productId })
      .sort({ createdAt: -1 });

    res.json(movements);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



// 📌 Movimiento por ID
export const getStockMovementById = async (req: Request, res: Response) => {
  try {
    const movement = await StockMovement.findById(req.params.id)
      .populate("product")
      .populate("user")
      .populate("sale");

    if (!movement) {
      return res.status(404).json({
        message: "StockMovement not found"
      });
    }

    res.json(movement);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// 📊 Resumen de movimientos
export const getStockSummary = async (
  req: AuthRequest,
  res: Response) => {
  try {
const scope = getOrganizationScope(req);

const result = await StockMovement.aggregate([
  {
    $match: scope
  },
  {
    $group: {
      _id: "$type",
      total: {
        $sum: "$quantity"
      }
    }
  }
]);

    res.json(result);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// ======================================================
// 🧠 INTEGRACIÓN CON VENTAS (LO IMPORTANTE)
// ======================================================
// 🔥 Registrar salida de stock cuando se vende
export const registerSaleMovement = async (
  saleId: string,
  user: string
) => {
  const items = await SaleItem.find({ sale: saleId });

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) continue;

    // ✅ SOLO REGISTRAR MOVIMIENTO
   await StockMovement.create({
  product: product._id,
  type: "out",
  quantity: item.quantity,

  user,

  reason: "sale",
  sale: saleId,
  stockAfter: product.stock,

  createdBy: item.createdBy,
  ownerAdmin: item.ownerAdmin
});
  }
};

// 🔥 Registrar devolución de stock cuando se cancela venta
export const registerCancelMovement = async (
  saleId: string,
  user: string
) => {
  const items = await SaleItem.find({ sale: saleId });

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    const newStock = product.stock + item.quantity;

    product.stock = newStock;
    await product.save();

    await StockMovement.create({
  product: product._id,
  type: "in",
  quantity: item.quantity,

  user,

  reason: "adjustment",
  sale: saleId,
  stockAfter: newStock,

  createdBy: item.createdBy,
  ownerAdmin: item.ownerAdmin
});
  }
};