import express from "express";
import {
  createStockMovement,
  getStockMovements,
  getMovementsByProduct,
  getStockMovementById,
  getStockSummary
} from "./controllers";

const router = express.Router();

router.post("/", createStockMovement);
router.get("/", getStockMovements);
router.get("/summary", getStockSummary);
router.get("/product/:productId", getMovementsByProduct);
router.get("/:id", getStockMovementById);

export default router;