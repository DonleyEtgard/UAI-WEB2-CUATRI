import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
  getProductStats,
} from "./controllers";

const router = express.Router();

// ======================================================
// UPLOADS DIRECTORY
// ======================================================

const uploadPath = path.resolve(
  __dirname,
  "../../uploads/products"
);

fs.mkdirSync(uploadPath, {
  recursive: true,
});

// ======================================================
// MULTER STORAGE
// ======================================================

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },

  filename: (_req, file, cb) => {
    const timestamp = Date.now();

    const safeName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "")
      .toLowerCase();

    cb(
      null,
      `${timestamp}-${safeName}`
    );
  },
});

// ======================================================
// MULTER CONFIG
// ======================================================

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },

  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(
        new Error(
          "Only image files are allowed"
        )
      );
    }

    cb(null, true);
  },
});

// ======================================================
// ROUTES
// ======================================================

// Crear producto
router.post(
  "/",
  upload.array("images", 5),
  createProduct
);

// Obtener todos
router.get(
  "/",
  getProducts
);

// Obtener uno
router.get(
  "/:id",
  getProductById
);

// Actualizar
router.put(
  "/:id",
  upload.array("images", 5),
  updateProduct
);

// Eliminar (soft delete)
router.delete(
  "/:id",
  deleteProduct
);

// Ajustar stock
router.patch(
  "/:id/stock",
  updateStock
);

// Estadísticas
router.get(
  "/:id/stats",
  getProductStats
);

export default router;