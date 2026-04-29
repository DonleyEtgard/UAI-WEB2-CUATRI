import { Request, Response } from "express";
import Customer from "../../models/Customer";

// 📌 Crear cliente
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, phone } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // ✅ evitar duplicados por email
    if (email) {
      const existing = await Customer.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Customer already exists" });
      }
    }

    const customer = await Customer.create({
      name,
      email,
      phone
    });

    res.status(201).json(customer);

  } catch (error: any) {
    res.status(500).json({
      message: "Error creating customer",
      error: error.message
    });
  }
};

// 📌 Obtener todos
export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await Customer.find({ isActive: true })
      .sort({ createdAt: -1 }); // 🔥 ordenados

    res.json(customers);

  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching customers",
      error: error.message
    });
  }
};

// 📌 Obtener por ID
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);

    if (!customer || !customer.isActive) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);

  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching customer",
      error: error.message
    });
  }
};

// 📌 Actualizar
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndUpdate(
      id,
      req.body, // 🔥 más flexible
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);

  } catch (error: any) {
    res.status(500).json({
      message: "Error updating customer",
      error: error.message
    });
  }
};

// 📌 Soft delete
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deleted successfully" });

  } catch (error: any) {
    res.status(500).json({
      message: "Error deleting customer",
      error: error.message
    });
  }
};