import { Request, Response } from "express";
import Customer from "../../models/Customer";
import { authenticateJWT } from '../../middlewares/authenticateJWT';

// 📌 Crear cliente
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, debt } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // ✅ evitar duplicados por email
    if (email) {
      const existing = await Customer.findOne({ email });

      if (existing) {
        return res.status(400).json({
          message: "Customer already exists"
        });
      }
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      debt: debt || 0,
      payments: []
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
    const customers = await Customer.find({
      isActive: true
    }).sort({ createdAt: -1 });

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
      return res.status(404).json({
        message: "Customer not found"
      });
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
      req.body,
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.json(customer);

  } catch (error: any) {
    res.status(500).json({
      message: "Error updating customer",
      error: error.message
    });
  }
};

// 📌 Agregar pago
export const addPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        message: "Amount is required"
      });
    }

    const customer = await Customer.findByIdAndUpdate(
      id,
      {
        $push: {
          payments: {
            amount,
            date: new Date()
          }
        },

        $inc: {
          debt: -amount
        }
      },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.json(customer);

  } catch (error: any) {
    res.status(500).json({
      message: "Error adding payment",
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
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.json({
      message: "Customer deleted successfully"
    });

  } catch (error: any) {
    res.status(500).json({
      message: "Error deleting customer",
      error: error.message
    });
  }
};