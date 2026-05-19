import express from "express";
import { authenticateJWT } from "../../middlewares/authenticateJWT";
import {
  createStockMovement,
  getStockMovements,
  getMovementsByProduct,
  getStockMovementById,
  getStockSummary
} from "./controllers";

const router = express.Router();

router.post("/", authenticateJWT, createStockMovement);
router.get("/", authenticateJWT, getStockMovements);
router.get("/summary", authenticateJWT, getStockSummary);
router.get("/product/:productId", authenticateJWT, getMovementsByProduct);
router.get("/:id", authenticateJWT, getStockMovementById);

export default router;