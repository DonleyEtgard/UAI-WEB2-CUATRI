import { Request, Response } from "express";
import Customer from "../../models/Customer";
import User from "../../models/User";
import type { AuthRequest } from "../../types/auth";

const getOwnerAdmin = (req: AuthRequest) =>
  req.dbUser?.ownerAdmin || req.dbUser?._id;

const getCustomerScope = async (req: AuthRequest, extra: Record<string, any> = {}) => {
  if (req.dbUser?.role === "superadmin") return extra;

  const ownerAdmin = getOwnerAdmin(req);
  const orgUsers = await User.find({
    $or: [
      { _id: ownerAdmin },
      { ownerAdmin },
      { createdBy: ownerAdmin },
    ],
  }).select("_id");

  const orgUserIds = orgUsers.map((user) => user._id);

  return {
    ...extra,
    $or: [
      { ownerAdmin },
      { createdBy: { $in: orgUserIds } },
      { user: { $in: orgUserIds } },
    ],
  };
};


export const createCustomer = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    console.log("BODY:", req.body);
    console.log("DB USER:", req.dbUser);
    const {
      name,
      email,
      phone,
      debt,
      initialPayment = 0,
      address,
      isActive,
    } = req.body;

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

    const totalDebt = Number(debt ?? 0);
    const paid = Number(initialPayment ?? 0);

    const finalDebt = Math.max(0, totalDebt - paid);

    const payments = [];

    if (initialPayment > 0) {
     payments.push({
     amount: paid,
     type: "initial",
     remainingDebt: finalDebt,
     createdBy: userId,
     ownerAdmin: getOwnerAdmin(req),
     date: new Date(),
});
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      address,

      debt: finalDebt,

      payments,

      isActive,

      user: userId,
      createdBy: userId,
      ownerAdmin: getOwnerAdmin(req),
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
    const customers = await Customer.find(
      await getCustomerScope(req, {
        isActive: true,
      })
    ).sort({
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

   const customer = await Customer.findOne(
     await getCustomerScope(req, {
       _id: id,
     })
   );

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

    console.log("SCOPE:", await getCustomerScope(req, { _id: id }));
    console.log("USER:", req.dbUser);
    const customer = await Customer.findOneAndUpdate(
      await getCustomerScope(req, {
        _id: id,
      }),
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

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Valid amount is required",
      });
    }

    const customer = await Customer.findOne(
      await getCustomerScope(req, {
        _id: id,
      })
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    if (amount > customer.debt) {
      return res.status(400).json({
        message: "Payment exceeds remaining debt",
      });
    }

    const paymentAmount = Number(amount);

    const remainingDebt = Math.max(
     0,
     customer.debt - paymentAmount
    );

   customer.payments.push({
    amount: paymentAmount,
    type: "payment",
    remainingDebt,
    createdBy: req.dbUser?._id,
     ownerAdmin: getOwnerAdmin(req),
    date: new Date(),
});

customer.debt = remainingDebt;

    await customer.save();

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

    const customer = await Customer.findOneAndUpdate(
      await getCustomerScope(req, {
        _id: id,
      }),
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
