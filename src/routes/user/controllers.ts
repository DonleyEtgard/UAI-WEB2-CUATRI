import axios from "axios";
import type { Response } from "express";
import admin from "../../firebase";
import User from "../../models/User";
import Payment from "../../models/Payment";
import type { AuthRequest } from "../../types/auth";

// ============================================================================
// AUTHENTICATION CONTROLLERS
// ============================================================================

const getOwnerAdmin = (req: AuthRequest) =>
  req.dbUser?.ownerAdmin || req.dbUser?._id;

const getUserScope = (
  req: AuthRequest,
  extra: Record<string, any> = {}
) => {

  if (req.dbUser?.role === "superadmin") {
    return extra;
  }

  const ownerAdmin =
    req.dbUser?.ownerAdmin ||
    req.dbUser?._id;

  return {
    ...extra,

    $or: [
      {
        _id: req.dbUser?._id
      },

      {
        ownerAdmin,
        role: "employee"
      }
    ]
  };
};

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

// ============================================================
// CHECK SUBSCRIPTION EXPIRATION
// ============================================================

  if (
  user.subscriptionEnd &&
  new Date() > user.subscriptionEnd &&
  user.subscriptionStatus !== "expired"
  ) {
  user.subscriptionStatus = "expired";
  user.paymentStatus = "unpaid";

  await user.save();
  }

// ============================================================
// RESPONSE
// ============================================================

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

      paymentStatus: "unpaid",

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
      address,
      role,
      phone,
      plan,
      isActive,
    } = req.body;

    // ================================================================
    // VALIDATION
    // ================================================================

    if (!firebaseUid || !email || !name || !lastName || !role) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: firebaseUid, email, name, lastName, role",
        error: "INVALID_INPUT",
      });
    }

    // ================================================================
    // ROLE VALIDATION
    // ================================================================
    const allowedRolesForAdmin = ["employee"];
    if (req.dbUser.role === "admin" && !allowedRolesForAdmin.includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Admins can only create employees.",
        error: "FORBIDDEN_ROLE",
      });
    }

    if (req.dbUser.role === "superadmin" && !["admin", "employee"].includes(role)) {
      return res.status(403).json({ success: false, message: "Invalid role for creation.", error: "FORBIDDEN_ROLE" });
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

  role: role,

  phone: phone || "",

  address: {
    street: address?.street || "",
    number: address?.number || "",
    city: address?.city || "",
    state: address?.state || "",
    country: address?.country || "Argentina",
    postalCode: address?.postalCode || "",
  },

  isVerified: true,

  isActive: isActive ?? true,

 plan: plan || "free",

subscriptionStatus:
  plan && plan !== "free"
    ? "active"
    : "expired",

  createdBy: req.dbUser._id,

  ownerAdmin:
    req.dbUser.role === "superadmin"
      ? req.body.ownerAdmin || req.dbUser.ownerAdmin || req.dbUser._id
      : req.dbUser._id
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

    const { id } = req.params;

    // Un usuario siempre puede ver su propio perfil
    const isOwnProfile = req.dbUser._id.toString() === id;
    if (isOwnProfile) {
      const user = await User.findById(id).select("-__v");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          error: "NOT_FOUND",
        });
      }
      return res.status(200).json({ success: true, data: { user } });
    }

    // Solo admin/superadmin pueden ver otros perfiles
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

    const user = await User.findOne(
      getUserScope(req, {
        _id: id,
      })
    ).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or you are not authorized to view it",
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
      });
    }

    if (
      !["admin", "superadmin"].includes(
        req.dbUser.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const skip =
      (page - 1) * limit;

    const filter =
      getUserScope(req);

    const users =
      await User.find(filter)
        .select("-__v")
        .skip(skip)
        .limit(limit)
        .sort({
          createdAt: -1,
        });

    const total =
      await User.countDocuments(
        filter
      );

    return res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(
            total / limit
          ),
        },
      },
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message,
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
      });
    }

    const { id } = req.params;

    const isOwnProfile =
      req.dbUser._id.toString() === id;

    if (
      !isOwnProfile &&
      !["admin", "superadmin"].includes(req.dbUser.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    let filter: any = { _id: id };

    if (
      req.dbUser.role === "admin" &&
      !isOwnProfile
    ) {
      filter.ownerAdmin =
        req.dbUser.ownerAdmin ||
        req.dbUser._id;

      filter.role = "employee";
    }

    const userToUpdate =
      await User.findOne(filter);

    if (!userToUpdate) {
      return res.status(404).json({
        success: false,
        message:
          "User not found or not authorized to update",
      });
    }

    if (
      req.dbUser.role === "superadmin" &&
      !isOwnProfile &&
      userToUpdate.role === "superadmin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Cannot modify another superadmin",
      });
    }

    if (
      req.dbUser.role === "admin" &&
      !isOwnProfile &&
      userToUpdate.role !== "employee"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Admins can only modify their own profile or employee profiles.",
      });
    }

    const updateData: any = {};

    if (req.body.name !== undefined) {
      updateData.name = req.body.name;
    }

    if (req.body.lastName !== undefined) {
      updateData.lastName = req.body.lastName;
    }

    if (req.body.phone !== undefined) {
      updateData.phone = req.body.phone;
    }

    if (req.body.email !== undefined) {
      const nextEmail = String(req.body.email).trim().toLowerCase();

      if (nextEmail && nextEmail !== userToUpdate.email) {
        updateData.email = nextEmail;

        if (userToUpdate.firebaseUid) {
          try {
            await admin.auth().updateUser(
              userToUpdate.firebaseUid,
              {
                email: nextEmail,
              }
            );
          } catch (firebaseError: any) {
            console.warn("Firebase email sync failed:", firebaseError.message);
          }
        }
      }
    }

    if (req.body.isActive !== undefined) {
      const nextIsActive = Boolean(req.body.isActive);

      if (!(isOwnProfile && !nextIsActive)) {
        if (
          req.dbUser.role === "superadmin" &&
          !isOwnProfile
        ) {
          updateData.isActive = nextIsActive;
        }

        if (
          req.dbUser.role === "admin" &&
          userToUpdate.role === "employee"
        ) {
          updateData.isActive = nextIsActive;
        }

        if (userToUpdate.firebaseUid && nextIsActive !== userToUpdate.isActive) {
          try {
            await admin.auth().updateUser(
              userToUpdate.firebaseUid,
              {
                disabled: !nextIsActive,
              }
            );
          } catch (firebaseError: any) {
            console.warn("Firebase active-state sync failed:", firebaseError.message);
          }
        }
      }
    }

    if (req.body.plan !== undefined) {
      const validPlans = [
        "free",
        "basic",
        "medium",
        "premium",
      ];

      if (
        !validPlans.includes(
          req.body.plan
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid plan",
        });
      }

      if (
        req.dbUser.role === "superadmin" ||
        (
          req.dbUser.role === "admin" &&
          userToUpdate.role === "employee"
        )
      ) {

        updateData.plan =
          req.body.plan;

        updateData.subscriptionStatus =
          req.body.plan === "free"
            ? "expired"
            : "active";
      }
    }

    // ==========================================================
    // MANUAL PAYMENT STATUS UPDATE
    // SOLO SUPERADMIN
    // ==========================================================

    if (req.body.paymentStatus !== undefined) {

      const validPaymentStatus = [
        "paid",
        "unpaid",
        "pending",
      ];

      if (
        !validPaymentStatus.includes(
          req.body.paymentStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment status",
        });
      }

      if (req.dbUser.role !== "superadmin") {

        return res.status(403).json({
          success: false,
          message:
            "Only superadmin can update payment status",
        });

      }

      updateData.paymentStatus =
        req.body.paymentStatus;

      // Si marcas como pagado
      if (
        req.body.paymentStatus === "paid"
      ) {

        updateData.subscriptionStatus =
          "active";

        updateData.subscriptionStart =
          new Date();

        const subscriptionEnd =
          new Date();

        subscriptionEnd.setMonth(
          subscriptionEnd.getMonth() + 1
        );

        updateData.subscriptionEnd =
          subscriptionEnd;

        updateData.lastPaymentDate =
          new Date();
      }

      // Si marcas como no pagado
      if (
        req.body.paymentStatus === "unpaid"
      ) {

        updateData.subscriptionStatus =
          "expired";
      }

      // Si está pendiente
      if (
        req.body.paymentStatus === "pending"
      ) {

        updateData.subscriptionStatus =
          "pending";

      }

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
      req.body.role &&
      req.body.role !== "superadmin"
    ) {

      if (
        req.dbUser.role === "superadmin"
      ) {

        if (
          ["admin", "employee"]
            .includes(req.body.role)
        ) {

          updateData.role =
            req.body.role;
        }

      } else if (
        req.dbUser.role === "admin"
      ) {

        if (
          req.body.role === "employee" &&
          userToUpdate.role === "employee"
        ) {

          updateData.role =
            req.body.role;
        }
      }
    }

    if (
      updateData.role &&
      userToUpdate.firebaseUid &&
      updateData.role !== userToUpdate.role
    ) {
      try {
        await admin.auth()
          .setCustomUserClaims(
            userToUpdate.firebaseUid,
            {
              role: updateData.role,
            }
          );
      } catch (firebaseError: any) {
        console.warn("Firebase role sync failed:", firebaseError.message);
      }
    }

    const user =
      await User.findOneAndUpdate(
        filter,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).select("-__v");

    return res.json({
      success: true,
      message:
        "User updated successfully",
      data: {
        user,
      },
    });

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================================
    // TOGGLE USER STATE
// ==========================================================

export const toggleUserStateController = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    
    if (!req.dbUser) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

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

    const { id } = req.params;

    if (
      req.dbUser._id.toString() === id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot toggle your own active state.",
        error: "BAD_REQUEST",
      });
    }

    console.log({
      currentUser: req.dbUser._id,
      ownerAdmin: req.dbUser.ownerAdmin,
      targetUser: id,
    });

    let user;

    if (req.dbUser.role === "superadmin") {

      user = await User.findById(id);

    } else {

      user = await User.findOne({
        _id: id,
        ownerAdmin:
          req.dbUser.ownerAdmin ||
          req.dbUser._id,
        role: "employee",
      });

    }

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found or you are not authorized to manage them",
      });
    }

    
    if (user.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message:
          "Cannot modify another superadmin",
        error: "FORBIDDEN",
      });
    }

    const newState = !user.isActive;

    
    if (user.firebaseUid) {

      try {

        await admin.auth().updateUser(
          user.firebaseUid,
          {
            disabled: !newState,
          }
        );

      } catch (firebaseError: any) {

        console.error(
          "Firebase update error:",
          firebaseError
        );

        return res.status(500).json({
          success: false,
          message:
            "Error updating user in Firebase",
          error: firebaseError.message,
        });

      }

    }

    // ==========================================================
    // UPDATE MONGODB
    // ==========================================================
    user.isActive = newState;

    await user.save();
    // ==========================================================
// IF ADMIN -> TOGGLE ALL EMPLOYEES
// ==========================================================

if (user.role === "admin") {

  const employees = await User.find({
    ownerAdmin: user._id,
    role: "employee",
  });

  for (const employee of employees) {

    employee.isActive = newState;

    await employee.save();

    if (employee.firebaseUid) {
      try {

        await admin.auth().updateUser(
          employee.firebaseUid,
          {
            disabled: !newState,
          }
        );

      } catch (err) {

        console.error(
          `Error updating employee ${employee.email}`,
          err
        );

      }
    }

  }

}

    // ==========================================================
    // RESPONSE
    // ==========================================================
    return res.json({
      success: true,
      message: `User ${
        user.isActive
          ? "activated"
          : "deactivated"
      } successfully`,
      data: {
        user,
      },
    });

  } catch (error: any) {

    console.error(
      "Toggle user state error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
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

    if (
      req.dbUser?.role !==
      "superadmin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const { id } = req.params;

    if (
      req.dbUser._id.toString() === id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete yourself",
      });
    }

    const user =
      await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      user.role === "superadmin" &&
      user._id.toString() !==
      req.dbUser._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Cannot deactivate another superadmin",
      });
    }

    user.isActive = false;

    await user.save();

    return res.json({
      success: true,
      message:
        "User deactivated successfully",
      data: {
        user,
      },
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message,
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
  return createSubscriptionPayment(req, res);
};

// ==========================
// getPendingPayments
// ==========================
export const getPendingPayments = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const payments = await Payment.find({
      status: { $in: ["pending", "pending_verification"] },
    })
      .populate("user", "name lastName email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: payments,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
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
    if (!req.dbUser || req.dbUser.role !== "superadmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const user = await User.findById(payment.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const monthsMap = {
      basic: 1,
      medium: 3,
      premium: 6,
    };

    const months =
      monthsMap[payment.plan as keyof typeof monthsMap];

    const start = new Date();
    const end = new Date(start);
    end.setMonth(end.getMonth() + months);

    payment.status = "paid";

    user.plan = payment.plan;
    user.subscriptionStatus = "active";
    user.paymentStatus = "paid";
    user.subscriptionStart = start;
    user.subscriptionEnd = end;

    user.lastPaymentDate = start;
    user.lastPaymentAmount = payment.amount;

    await payment.save();
    await user.save();

    return res.json({
      success: true,
      message: "Payment approved and subscription activated",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
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
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  const { plan, provider, currency = "ARS" } = req.body;

  if (!plan || !provider) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: plan and provider",
    });
  }

  const mpAccessToken = process.env.MP_ACCESS_TOKEN?.trim();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const planPrices = {
   mercadopago: {
    basic: 30000,
    medium: 85000,
    premium: 170000,
  },

  moncash: {
    basic: 2500,
    medium: 7500,
    premium: 15000,
  },
};

const providerPlans =
  planPrices[
    provider as keyof typeof planPrices
  ];

if (!providerPlans) {
  return res.status(400).json({
    message: "Invalid payment provider",
  });
}

const basePrice =
  providerPlans[
    plan as keyof typeof providerPlans
  ];

if (!basePrice) {
  return res.status(400).json({
    message: "Invalid plan",
  });
}

const fee =
  provider === "moncash"
    ? basePrice * 0.05
    : 0;

const total = basePrice + fee;

    const payment = await Payment.create({
      user: user._id,
      plan,
      amount: total,
      currency,
      method: provider,
      provider,
      status: provider === "mercadopago" ? "pending" : "pending_verification",
      providerStatus: "pending",
    });

    // ==========================
    // MERCADO PAGO FLOW
    // ==========================
    if (provider === "mercadopago") {
      if (!mpAccessToken || mpAccessToken.includes("XXXXXXXXXXXXXXXX")) {
        return res.status(500).json({
          success: false,
          message: "Mercado Pago is not configured.",
          error: "MP_ACCESS_TOKEN_MISSING",
        });
      }

      const preference = {
        items: [
          {
            title: `Subscription ${plan}`,
            quantity: 1,
            unit_price: total,
            currency_id: currency,
          },
        ],
        external_reference: payment._id.toString(),
        back_urls: {
          success: `${frontendUrl}/app/subscription?status=success`,
          failure: `${frontendUrl}/app/subscription?status=failure`,
          pending: `${frontendUrl}/app/subscription?status=pending`,
        },
        auto_return: "approved",
      };

      const mpRes = await axios.post(
        "https://api.mercadopago.com/checkout/preferences",
        preference,
        {
          headers: {
            Authorization: `Bearer ${mpAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      payment.initPoint = mpRes.data.init_point;
      payment.externalReference = mpRes.data.id;

      await payment.save();

      return res.json({
        success: true,
        paymentUrl: mpRes.data.init_point,
        paymentId: payment._id,
      });
    }

    // ==========================
    // MONCASH FLOW
    // ==========================
    payment.qrData = `MONCASH-${payment._id}-${Date.now()}`;
    payment.qrImage = `moncash://pay?amount=${total}`;

    await payment.save();

    return res.json({
      success: true,
      qr: payment.qrImage,
      paymentId: payment._id,
      status: payment.status,
    });
  } catch (error: any) {
    console.error("❌ CREATE PAYMENT ERROR FULL:", error?.response?.data || error);
    console.error("❌ STATUS:", error?.response?.status);

    return res.status(500).json({
      success: false,
      message: "Error creating payment",
      error: error?.response?.data?.message || error?.message,
      details: error?.response?.data,
      status: error?.response?.status,
    });
  }
};

export const mercadoPagoWebhook = async (req: AuthRequest, res: Response) => {
  try {
    const { data } = req.body;

    const paymentId = data?.id;

    if (!paymentId) return res.sendStatus(200);

    const mpResponse = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    const paymentData = mpResponse.data;

    if (paymentData.status !== "approved") {
      return res.sendStatus(200);
    }

    const payment = await Payment.findOne({
      externalReference: paymentData.external_reference,
    });

    if (!payment) return res.sendStatus(200);

    payment.status = "paid";
    payment.providerStatus = "approved";

    const user = await User.findById(payment.user);

    if (user) {
      const monthsMap = {
        basic: 1,
        medium: 3,
        premium: 6,
      };

      const months = monthsMap[payment.plan as keyof typeof monthsMap];

      const start = new Date();
      const end = new Date(start);
      end.setMonth(end.getMonth() + months);

      user.plan = payment.plan;
      user.subscriptionStatus = "active";
      user.paymentStatus = "paid";
      user.subscriptionStart = start;
      user.subscriptionEnd = end;

      user.lastPaymentDate = start;
      user.lastPaymentAmount = payment.amount;

      await user.save();
    }

    await payment.save();

    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(200);
  }
};