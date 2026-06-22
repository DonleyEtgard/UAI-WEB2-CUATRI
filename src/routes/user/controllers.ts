import axios from "axios";
import type { Response } from "express";
import admin from "../../firebase";
import User from "../../models/User";
import Payment from "../../models/Payment";
import type { AuthRequest } from "../../types/auth";
// ============================================================================
// AUTHENTICATION CONTROLLERS
// ============================================================================

export const getMeController = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    // ===================================================================
    // VALIDATION
    // ===================================================================

    if (!req.firebaseUser) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        error: "NO_AUTH",
      });
    }

    // ===================================================================
    // GET USER FROM DATABASE
    // ===================================================================

    const user = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    }).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
        error: "USER_NOT_FOUND",
      });
    }

    // ===================================================================
    // RESPONSE
    // ===================================================================

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });

  } catch (error: any) {

    console.error("Get me error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });

  }
};

/**
 * POST /api/users/register
 * Public register
 * ALWAYS creates ADMIN users
 */
export const registerController = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    // ===================================================================
    // VALIDATION
    // ===================================================================

    const {
      name,
      lastName,
      email,
      firebaseUid,
      image,
      address,
    } = req.body;

    if (!firebaseUid || !email || !name || !lastName) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: firebaseUid, email, name, lastName",
        error: "INVALID_INPUT",
      });
    }

    // ===================================================================
    // CHECK IF USER EXISTS
    // ===================================================================

    const existingUser = await User.findOne({
      $or: [{ email }, { firebaseUid }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email or Firebase UID",
        error: "USER_EXISTS",
      });
    }

    // ===================================================================
    // CREATE USER IN MONGODB
    // ===================================================================

    const now = new Date();

    const trialEnd = new Date(now);
     trialEnd.setMonth(
     trialEnd.getMonth() + 1
     );

    // ================================================================
    // PUBLIC REGISTER = ADMIN
    // ================================================================

    const mongoRole = "admin";

    const newUser = new User({
      firebaseUid,
      email,
      name,
      lastName,

      // ================================================================
      // USER DATA
      // ================================================================

      role: mongoRole,

      image: image || "",

      address: {
        street: address?.street || "",
        number: address?.number || "",
        city: address?.city || "",
        state: address?.state || "",
        country: address?.country || "Argentina",
        postalCode: address?.postalCode || "",
      },

      // ================================================================
      // DEFAULTS
      // ================================================================

      plan: "free",

      subscriptionStatus: "active",

      trialUsed: true,

      trialEnd,

      subscriptionStart: now,

     subscriptionEnd: trialEnd,

     subscriptionPaid: false,

     isVerified: false,

      isActive: true,
    });

    await newUser.save();

    newUser.ownerAdmin = newUser._id;
    await newUser.save();

    // ===================================================================
    // RESPONSE
    // ===================================================================

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: newUser,
      },
    });

  } catch (error: any) {

    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });

  }
};

// ============================================================================
// CREATE EMPLOYEE
// Admin/Superadmin can create employees
// ============================================================================

export const createEmployeeController = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    // ================================================================
    // AUTH VALIDATION
    // ================================================================
    


    if (!req.dbUser) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        error: "NO_AUTH",
      });
    }

    // ================================================================
    // ONLY ADMIN OR SUPERADMIN
    // ================================================================

    if (
      !["admin", "superadmin"].includes(
        req.dbUser.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
        error: "FORBIDDEN",
      });
    }

    // ================================================================
    // DATA
    // ================================================================

    const {
      firebaseUid,
      email,
      name,
      lastName,
      image,
      address,
    } = req.body;

    // ================================================================
    // VALIDATION
    // ================================================================

    if (
      !firebaseUid ||
      !email ||
      !name ||
      !lastName
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        error: "INVALID_INPUT",
      });
    }

    // ================================================================
    // CHECK EXISTING USER
    // ================================================================

    const existingUser = await User.findOne({
      $or: [
        { email },
        { firebaseUid }
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
        error: "USER_EXISTS",
      });
    }

    // ================================================================
    // CREATE EMPLOYEE
    // ================================================================

 const employee = new User({
  firebaseUid,
  email,
  name,
  lastName,

  role: "employee",

  image: image || "",

  address: {
    street: address?.street || "",
    number: address?.number || "",
    city: address?.city || "",
    state: address?.state || "",
    country: address?.country || "Argentina",
    postalCode: address?.postalCode || "",
  },

  isVerified: true,

  isActive: true,

  plan: "free",

 subscriptionStatus: "active",

  createdBy: req.dbUser._id,

  ownerAdmin:
    req.dbUser.role === "superadmin"
      ? req.body.ownerAdmin || req.dbUser.ownerAdmin || req.dbUser._id
      : req.dbUser.ownerAdmin || req.dbUser._id
});

    await employee.save();

    // ================================================================
    // RESPONSE
    // ================================================================

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: {
        user: employee,
      },
    });

  } catch (error: any) {

    console.error("Create employee error:", error);

    return res.status(500).json({
      success: false,
      message: "Error creating employee",
      error: error.message,
    });

  }
};

/**
 * GET /api/users/:id
 * Get user by ID (Admin/SuperAdmin only)
 */
export const getUserByIdController = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    if (!req.dbUser) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        error: "NO_AUTH",
      });
    }

    if (
      !["admin", "superadmin"].includes(
        req.dbUser.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Only admins can view other users",
        error: "FORBIDDEN",
      });
    }

    const { id } = req.params;

    const filter =
      req.dbUser.role === "superadmin"
        ? { _id: id }
        : {
            _id: id,
            $or: [
              { _id: req.dbUser.ownerAdmin || req.dbUser._id },
              { ownerAdmin: req.dbUser.ownerAdmin || req.dbUser._id },
              { createdBy: req.dbUser.ownerAdmin || req.dbUser._id },
            ],
          };

    const user = await User.findOne(filter)
      .select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });

  } catch (error: any) {

    console.error("Get user error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });

  }
};

/**
 * GET /api/users
 * List all users
 */
export const listUsersController = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    if (!req.dbUser) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        error: "NO_AUTH",
      });
    }

    if (
      !["admin", "superadmin"].includes(
        req.dbUser.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Only admins can list users",
        error: "FORBIDDEN",
      });
    }

    const page =
      parseInt(req.query.page as string) || 1;

    const limit =
      parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    let filter = {};

    // ====================================================
    // ADMIN -> ONLY HIS USERS
    // ====================================================

    if (req.dbUser.role === "admin") {
      const ownerAdmin =
        req.dbUser.ownerAdmin || req.dbUser._id;

      filter = {
        $or: [
          { _id: ownerAdmin },
          { ownerAdmin },
          { createdBy: ownerAdmin },
          { createdBy: req.dbUser._id },
        ],
      };
    }

    // ====================================================
    // SUPERADMIN -> ALL USERS
    // ====================================================

    const users = await User.find(filter)
      .select("-__v")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total =
      await User.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });

  } catch (error: any) {

    console.error(
      "List users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error listing users",
      error: error.message,
    });

  }
};

/**
 * PATCH /api/users/:id
 * Update user
 */
export const updateUserController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.dbUser) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        error: "NO_AUTH",
      });
    }

    const { id } = req.params;

    const isOwnProfile =
      req.dbUser._id.toString() === id;

    const canManageUsers =
      req.dbUser.role === "admin" ||
      req.dbUser.role === "superadmin";

    if (!isOwnProfile && !canManageUsers) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
        error: "FORBIDDEN",
      });
    }

    const ownerAdmin =
      req.dbUser.ownerAdmin ||
      req.dbUser._id;

    // =====================================================
    // FILTRO DE SEGURIDAD
    // =====================================================

    const filter =
      req.dbUser.role === "superadmin"
        ? { _id: id }
        : isOwnProfile
        ? { _id: id }
        : {
            _id: id,
            ownerAdmin,
          };

    // =====================================================
    // WHITELIST DE CAMPOS EDITABLES
    // =====================================================

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (req.body.name !== undefined) {
      updateData.name = req.body.name;
    }

    if (req.body.lastName !== undefined) {
      updateData.lastName = req.body.lastName;
    }

    if (req.body.image !== undefined) {
      updateData.image = req.body.image;
    }

    if (req.body.phone !== undefined) {
      updateData.phone = req.body.phone;
    }

    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive;
    }

    if (req.body.address) {
      updateData.address = {
        street:
          req.body.address.street || "",
        number:
          req.body.address.number || "",
        city:
          req.body.address.city || "",
        state:
          req.body.address.state || "",
        country:
          req.body.address.country || "",
        postalCode:
          req.body.address.postalCode || "",
      };
    }

    if (
      req.dbUser.role === "superadmin" &&
      req.body.role
    ) {
      updateData.role = req.body.role;
    }

    const user = await User.findOneAndUpdate(
      filter,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        user,
      },
    });

  } catch (error: any) {
    console.error(
      "Update user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};


/**
 * DELETE /api/users/:id
 * Delete user (Superadmin only)
 */
export const deleteUserController = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    // ==========================================================
    // AUTH
    // ==========================================================

    if (!req.dbUser) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        error: "NO_AUTH"
      });
    }

    // ==========================================================
    // ONLY SUPERADMIN
    // ==========================================================

    if (req.dbUser.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Only superadmin can delete users",
        error: "FORBIDDEN"
      });
    }

    const { id } = req.params;

    // ==========================================================
    // CANNOT DELETE HIMSELF
    // ==========================================================

    if (req.dbUser._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
        error: "SELF_DELETE"
      });
    }

    // ==========================================================
    // DELETE
    // ==========================================================

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "NOT_FOUND"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {
        id
      }
    });

  } catch (error: any) {

    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message
    });

  }
};

// ==========================
// 💳 PAYMENT SUBSCRIPTION
// ==========================

export const paySubscription = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const userId = req.dbUser?._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message:
          "Only admins can purchase subscriptions"
      });
    }

    const {
      plan,
      paymentMethod
    } = req.body;

    const plans = {
      basic: {
        months: 1,
        price: 80000
      },
      medium: {
        months: 3,
        price: 220000
      },
      premium: {
        months: 6,
        price: 440000
      }
    };

    const selectedPlan =
      plans[plan as keyof typeof plans];

    if (!selectedPlan) {
      return res.status(400).json({
        message: "Invalid plan"
      });
    }

    let total =
      selectedPlan.price;

    if (paymentMethod === "moncash") {
      total += selectedPlan.price * 0.05;
    }

    const startDate =
      new Date();

    const endDate =
      new Date(startDate);

    endDate.setMonth(
      endDate.getMonth() +
      selectedPlan.months
    );

    user.plan = plan;

    user.subscriptionStatus = "pending";
     user.subscriptionPaid = false;

    user.lastPaymentMethod =
      paymentMethod;

    user.lastPaymentAmount =
      selectedPlan.price;

    user.lastPaymentDate =
      new Date();
    await Payment.create({
    user: user._id,
    plan,
    amount: total,
    method: paymentMethod,
    status: "pending",
    qrData:
     paymentMethod === "moncash"
      ? `QR-${user._id}-${Date.now()}`
      : undefined
});
    await user.save();

    return res.json({
      success: true,
      message:
        "Subscription activated",
      plan,
      paymentMethod,
      totalPaid: total,
      subscriptionEnd: endDate,
      qrCode:
        paymentMethod === "moncash"
          ? `QR-${user._id}-${Date.now()}`
          : null
    });

  } catch (error: any) {

    console.error(
      "Subscription payment error:",
      error
    );

    return res.status(500).json({
      message:
        "Error updating subscription",
      error: error.message
    });

  }
};

export const getPendingPayments = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const payments =
      await Payment.find({
        status: "pending"
      })
      .populate(
        "user",
        "name lastName email"
      )
      .sort({
        createdAt: -1
      });

    return res.json(payments);

  } catch (error: any) {

    return res.status(500).json({
      message: error.message
    });

  }
};

// ==========================
// 💳 APPROVE PAYMENT
// ==========================
export const approvePayment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (
      !req.dbUser ||
      req.dbUser.role !== "superadmin"
    ) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    const payment = await Payment.findById(
      req.params.id
    );

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found"
      });
    }

    const user = await User.findById(
      payment.user
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const plans = {
      basic: 1,
      medium: 3,
      premium: 6
    };

    const months =
      plans[
        payment.plan as keyof typeof plans
      ];

    const startDate = new Date();

    const endDate = new Date(startDate);

    endDate.setMonth(
      endDate.getMonth() + months
    );

    payment.status = "paid";

    user.plan = payment.plan;
    user.subscriptionPaid = true;
    user.subscriptionStart = startDate;
    user.subscriptionEnd = endDate;
    user.subscriptionStatus = "active";

    await payment.save();
    await user.save();

    return res.json({
      success: true,
      message:
        "Subscription activated"
    });

  } catch (error: any) {

    return res.status(500).json({
      message: error.message
    });

  }
};

// ==========================
// 💳 CREATE PAYMENT
// ==========================

export const createSubscriptionPayment = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const userId = req.dbUser?._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const {
      plan
    } = req.body;

    const plans = {
      basic: 80000,
      medium: 220000,
      premium: 440000
    };

    const price =
      plans[plan as keyof typeof plans];

    if (!price) {
      return res.status(400).json({
        message: "Invalid plan"
      });
    }

    const fee =
      price * 0.05;

    const total =
      price + fee;

    return res.json({
      plan,
      basePrice: price,
      fee,
      total,
      qr:
        `moncash://pay?amount=${total}`
    });

  } catch (error: any) {

    return res.status(500).json({
      message:
        "Error creating payment",
      error: error.message
    });

  }
};