import express from "express";
import { authenticateJWT } from "../../middlewares/authenticateJWT";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} from "./controllers";

const router = express.Router();

router.post("/", authenticateJWT, createCustomer);
router.get("/", authenticateJWT, getCustomers);
router.get("/:id", authenticateJWT, getCustomerById);
router.put("/:id", authenticateJWT, updateCustomer);
router.delete("/:id", authenticateJWT, deleteCustomer);

export default router;