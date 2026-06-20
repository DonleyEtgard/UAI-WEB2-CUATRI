import * as productService from "../../services/products.service";

import type {
  Product, 
  Category, 
  Currency, 
  ProductStats 
} from "./types";

// Re-export service functions as feature actions
export const fetchProducts = 
  productService.getProducts;

export const fetchProductById = 
  productService.getProductById;

export const createProductAction = 
  productService.createProduct;

export const updateProductAction = 
  productService.updateProduct;

export const deleteProductAction = 
  productService.deleteProduct;

export const updateStockAction = 
  productService.updateStock;

export const fetchProductStats = 
  productService.getProductStats;