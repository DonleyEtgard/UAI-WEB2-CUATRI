import express from "express";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer, 
  addPayment
} from "./controllers";

const router = express.Router();

router.post("/", authenticateFirebase, createCustomer);
router.get("/", authenticateFirebase, getCustomers);
router.get("/:id", authenticateFirebase, getCustomerById);
router.put("/:id", authenticateFirebase, updateCustomer);
router.delete("/:id", authenticateFirebase, deleteCustomer);
router.post("/:id/payment", authenticateFirebase, addPayment);

export default router;