import { Request, Response } from "express";
import Product from "../../models/Product";
import Customer from "../../models/Customer";
import Sale from "../../models/Sale";
import type { AuthRequest } from "../../types/auth";

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // SUPERADMIN VE TODO
    if (user.role === "superadmin") {
      const [products, customers, sales] = await Promise.all([
        Product.countDocuments({}),
        Customer.countDocuments({}),
        Sale.countDocuments({}),
      ]);

      return res.json({
        scope: "global",
        products,
        customers,
        sales,
      });
    }

    // ADMIN / EMPLOYEE → SOLO SU ORGANIZACIÓN
    const ownerAdmin = user.ownerAdmin || user._id;

    const scope = {
      ownerAdmin,
    };

    const [products, customers, sales] = await Promise.all([
      Product.countDocuments(scope),
      Customer.countDocuments(scope),
      Sale.countDocuments(scope),
    ]);

    return res.json({
      scope: "organization",
      products,
      customers,
      sales,
    });

  } catch (error: any) {
    return res.status(500).json({
      message: "Error loading dashboard",
      error: error.message,
    });
  }
};