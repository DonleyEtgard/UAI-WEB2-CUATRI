import { Request, Response } from "express";
import Customer from "../../models/Customer";
import type { AuthRequest } from "../../types/auth";

export const createCustomer = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    console.log("BODY:", req.body);
    console.log("DB USER:", req.dbUser);
    const { name, email, phone, debt, address, payments, isActive } = req.body;

    const userId = req.dbUser?._id;

    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // evitar duplicados por usuario
    if (email) {
      const existing = await Customer.findOne({
        email,
        user: userId,
      });

      if (existing) {
        return res.status(400).json({
          message: "Customer already exists",
        });
      }
    }
  
    const customer = await Customer.create({
      name,
      email,
      phone,
      debt,
      address,
      payments,
      isActive,
      user: userId,
    });

    res.status(201).json(customer);
  } catch (error: any) {
    res.status(500).json({
      message: "Error creating customer",
      error: error.message,
    });
  }
};

// ======================================
// GET CUSTOMERS
// ======================================

export const getCustomers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.dbUser?._id;

    const customers = await Customer.find({
      user: userId,
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    res.json(customers);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching customers",
      error: error.message,
    });
  }
};

// ======================================
// GET CUSTOMER BY ID
// ======================================

export const getCustomerById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const userId = req.dbUser?._id;

   const customer = await Customer.findOne({
  _id: id,
  user: userId,
});

if (!customer) {
  return res.status(404).json({ message: "Customer not found" });
}

    res.json(customer);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching customer",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE CUSTOMER
// ======================================

export const updateCustomer = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const userId = req.dbUser?._id;

    const customer = await Customer.findOneAndUpdate(
      {
        _id: id,
        user: userId,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json(customer);
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating customer",
      error: error.message,
    });
  }
};

// ======================================
// ADD PAYMENT
// ======================================

export const addPayment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const userId = req.dbUser?._id;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Valid amount is required",
      });
    }

    const customer = await Customer.findOneAndUpdate(
      {
        _id: id,
        user: userId,
      },
      {
        $push: {
          payments: {
            amount,
            date: new Date(),
          },
        },

        $inc: {
          debt: -amount,
        },
      },
      {
        new: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json(customer);
  } catch (error: any) {
    res.status(500).json({
      message: "Error adding payment",
      error: error.message,
    });
  }
};

// ======================================
// DELETE CUSTOMER (SOFT DELETE)
// ======================================

export const deleteCustomer = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const userId = req.dbUser?._id;

    const customer = await Customer.findOneAndUpdate(
      {
        _id: id,
        user: userId,
      },
      {
        isActive: false,
      },
      {
        new: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json({
      message: "Customer deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error deleting customer",
      error: error.message,
    });
  }
};