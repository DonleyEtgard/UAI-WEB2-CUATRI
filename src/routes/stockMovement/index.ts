import express from "express";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import {
  createStockMovement,
  getStockMovements,
  getMovementsByProduct,
  getStockMovementById,
  getStockSummary
} from "./controllers";

const router = express.Router();

router.post("/", authenticateFirebase, createStockMovement);
router.get("/", authenticateFirebase, getStockMovements);
router.get("/summary", authenticateFirebase, getStockSummary);
router.get("/product/:productId", authenticateFirebase, getMovementsByProduct);
router.get("/:id", authenticateFirebase, getStockMovementById);

export default router;