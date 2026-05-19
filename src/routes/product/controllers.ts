import { Request, Response } from "express";
import Joi from "joi";
import Product from "../../models/Product";
import SaleItem from "../../models/SaleItem";

// Validation schemas
const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  price: Joi.number().min(0).required(),
  cost: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  description: Joi.string().max(500).optional(),
  category: Joi.string().max(50).optional()
});

// 📌 Crear producto
export const createProduct = async (req: Request, res: Response) => {
  try {
    // Validate input
    const { error, value } = createProductSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        error: error.details[0].message
      });
    }

    const { name, price, cost, stock, description, category } = value;

    // ✅ Evitar duplicados por nombre
    const existing = await Product.findOne({ name });
    if (existing) {
      return res.status(400).json({
        message: "Product already exists"
      });
    }

    const product = await Product.create({
      name,
      price,
      cost,
      stock,
      description,
      category
    });

    res.status(201).json(product);

  } catch (error: any) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message
    });
  }
};

// 📌 Obtener todos los productos
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message
    });
  }
};

// 📌 Obtener producto por ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);

  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching product",
      error: error.message
    });
  }
};

// 📌 Actualizar producto
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);

  } catch (error: any) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message
    });
  }
};

// 📌 Eliminar producto (soft delete)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({ message: "Product deleted successfully" });

  } catch (error: any) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message
    });
  }
};
export const getProductStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const stats = await SaleItem.aggregate([
      { $match: { product: product._id } },
      {
        $group: {
          _id: null,
          totalSold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$subtotal" }
        }
      }
    ]);

    const totalSold = stats[0]?.totalSold || 0;
    const totalRevenue = stats[0]?.totalRevenue || 0;

    const profit = totalSold * (product.price - product.cost);

    res.json({
      product,
      stats: {
        stock: product.stock,
        totalSold,
        totalRevenue,
        profit
      }
    });

  } catch (error: any) {
    res.status(500).json({
      message: "Error getting product stats",
      error: error.message
    });
  }
};

// 📌 Ajustar stock manualmente (MUY IMPORTANTE 🔥)
export const updateStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity == null) {
      return res.status(400).json({
        message: "Quantity is required"
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    product.stock += quantity;

    if (product.stock < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative"
      });
    }

    await product.save();

    res.json(product);

  } catch (error: any) {
    res.status(500).json({
      message: "Error updating stock",
      error: error.message
    });
  }
};