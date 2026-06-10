import { Request, Response } from "express";
import Joi from "joi";
import Product from "../../models/Product";
import SaleItem from "../../models/SaleItem";
import type { AuthRequest } from "../../types/auth";

// FIX: Parse image URLs from a variety of input shapes (stringified JSON, CSV, array)
const parseImageUrls = (raw: any): string[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

// FIX: Build accessible URLs for files saved by multer
const getUploadedImageUrls = (req: Request): string[] => {
  const files = (req.files as Express.Multer.File[]) || [];
  const host = req.get("host");
  const protocol = req.protocol;
  return files.map((file) => `${protocol}://${host}/uploads/products/${file.filename}`);
};

// Validation schemas
const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  price: Joi.number().min(0).required(),
  cost: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  description: Joi.string().allow("").optional(),
  category: Joi.string().allow("").optional(),
  isActive: Joi.boolean().optional(),

  imageUrls: Joi.any().optional(),

  images: Joi.array()
    .items(Joi.string())
    .default([]),
});

// 📌 Desactivar producto
export const deactivateProduct = async (
  req: AuthRequest,
  res: Response
) => {
  try {
     console.log("BODY:", req.body);
     console.log("DB USER:", req.dbUser);
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        isActive: false
      },
      {
        new: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product deactivated",
      product
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};
// 📌 Reactivar producto
export const activateProduct = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        isActive: true
      },
      {
        new: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product activated",
      product
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};

// 📌 Crear producto
export const createProduct = async (
req: AuthRequest,
res: Response
) => {
try {
console.log("========== CREATE PRODUCT ==========");
console.log("BODY:", req.body);
console.log("FILES:", req.files);
console.log("DB USER:", req.dbUser);


// Verificar usuario autenticado
if (!req.dbUser) {
  return res.status(401).json({
    message: "User not found",
  });
}

// Imágenes existentes + nuevas
const imageUrls = parseImageUrls(
  req.body.imageUrls || req.body.images
);

const uploadedUrls = getUploadedImageUrls(req);

const images = [
  ...imageUrls,
  ...uploadedUrls,
];

// Multipart/FormData envía todo como string
const payload = {
  name: req.body.name,
  description: req.body.description,
  price: Number(req.body.price),
  cost: Number(req.body.cost),
  stock: Number(req.body.stock),
  category: req.body.category,
  isActive: req.body.isActive === "true",
  images,
};
console.log("PAYLOAD:", payload);

const { error, value } =
  createProductSchema.validate(payload, {
    allowUnknown: true,
  });

if (error) {
  console.log("JOI ERROR:", error.details);

  return res.status(400).json({
    message: "Validation error",
    error: error.details[0].message,
  });
}

const {
  name,
  price,
  cost,
  stock,
  description,
  category,
  isActive,
} = value;

// Evitar duplicados
const existing = await Product.findOne({
  name: name.trim(),
  user: req.dbUser._id,
  isActive: true,
});

if (existing) {
  return res.status(400).json({
    message: "Product already exists",
  });
}

const product = await Product.create({
  name: name.trim(),
  price,
  cost,
  stock,
  description,
  category,
  images,
  user: req.dbUser._id,
  isActive: isActive ?? true,
});

console.log("PRODUCT CREATED:", product._id);

return res.status(201).json({
  success: true,
  product,
});


} catch (error: any) {
console.error(
"CREATE PRODUCT ERROR:",
error
);

return res.status(500).json({
  success: false,
  message: "Error creating product",
  error: error.message,
});

}
};

// 📌 Obtener todos los productos
export const getProducts = async (_req: AuthRequest, res: Response) => {
  try {
    const products = await Product.find({
        user: _req.dbUser?._id,
       isActive: true
        })
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
export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
  _id: id,
  user: req.dbUser?._id,
  isActive: true
});
  
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
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const imageUrls = parseImageUrls(req.body.imageUrls || req.body.images);
    const uploadedUrls = getUploadedImageUrls(req);
    const images = [...imageUrls, ...uploadedUrls];

    const updatePayload = {
      ...req.body,
      images,
    };

    const product = await Product.findOneAndUpdate(
      {
        _id: id,
        user: req.dbUser?._id,
      },
      updatePayload,
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
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

   const product = await Product.findOneAndUpdate(
  {
    _id: id,
    user: req.dbUser?._id
  },
  {
    isActive: false
  },
  {
    new: true
  }
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
export const getProductStats = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

     const product = await Product.findOne({
          _id: id,
           user: req.dbUser?._id,
         isActive: true
       });
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
export const updateStock = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity == null) {
      return res.status(400).json({
        message: "Quantity is required"
      });
    }

    const product = await Product.findOne({
  _id: id,
  user: req.dbUser?._id
});

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