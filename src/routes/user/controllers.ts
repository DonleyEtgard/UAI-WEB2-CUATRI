import axios from "axios";
import type { Response } from "express";
import admin from "../../firebase";
import User from "../../models/User";
import type { AuthRequest } from "../../types/auth";

// ============================================================================
// AUTHENTICATION CONTROLLERS
// ============================================================================

/**
 * GET /api/users/me
 * Get current authenticated user profile from MongoDB
 * Requires: Firebase Authentication
 */
export const getMeController = async (req: AuthRequest, res: Response) => {
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
 * Register new user in MongoDB after Firebase registration
 * Called from frontend after Firebase auth.createUserWithEmailAndPassword()
 * Requires: Firebase ID Token
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
      role,
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
    // BLOCK SUPERADMIN CREATION
    // ===================================================================

    if (role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Not allowed to create superadmin",
        error: "FORBIDDEN_ROLE",
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

    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 3);

    const mongoRole =
      role && typeof role === "string" ? role : "employee";

    const newUser = new User({
      firebaseUid,
      email,
      name,
      lastName,

      // ================================================================
      // NEW FIELDS
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
      isVerified: false,
      isActive: true,

      subscriptionStart: now,
      subscriptionEnd,
      subscriptionPaid: false,
    });

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

/**
 * GET /api/users/:id
 * Get user by ID (Admin/SuperAdmin only)
 * Requires: Firebase Authentication + Admin Role
 */
export const getUserByIdController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // ===================================================================
    // VALIDATION
    // ===================================================================

    if (!req.dbUser) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        error: "NO_AUTH",
      });
    }

    // Check if user is admin or superadmin
    if (!["admin", "superadmin"].includes(req.dbUser.role)) {
      return res.status(403).json({
        success: false,
        message: "Only admins can view other users",
        error: "FORBIDDEN",
      });
    }

    const { id } = req.params;

    // ===================================================================
    // GET USER
    // ===================================================================

    const user = await User.findById(id).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "NOT_FOUND",
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
 * List all users (Admin/SuperAdmin only)
 * Requires: Firebase Authentication + Admin Role
 */
export const listUsersController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // ===================================================================
    // VALIDATION
    // ===================================================================

    if (!req.dbUser) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        error: "NO_AUTH",
      });
    }

    // Check if user is admin or superadmin
    if (!["admin", "superadmin"].includes(req.dbUser.role)) {
      return res.status(403).json({
        success: false,
        message: "Only admins can list users",
        error: "FORBIDDEN",
      });
    }

    // ===================================================================
    // GET USERS
    // ===================================================================

    const page = parseInt(req.query.page as string) || 1;

    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-__v")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    // ===================================================================
    // RESPONSE
    // ===================================================================

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
    console.error("List users error:", error);

    return res.status(500).json({
      success: false,
      message: "Error listing users",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/users/:id
 * Update user (user can update own profile, admin/superadmin can update any)
 * Requires: Firebase Authentication
 */
export const updateUserController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // ===================================================================
    // VALIDATION
    // ===================================================================

    if (!req.dbUser) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        error: "NO_AUTH",
      });
    }

    const { id } = req.params;

    const updates = req.body;

    // Check authorization
    const isOwnProfile = req.dbUser._id.toString() === id;

    const isAdmin = ["admin", "superadmin"].includes(
      req.dbUser.role
    );

    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Can only update your own profile",
        error: "FORBIDDEN",
      });
    }

    // Don't allow role updates except by superadmin
    if (updates.role && req.dbUser.role !== "superadmin") {
      delete updates.role;
    }

    // Don't allow firebaseUid updates
    if (updates.firebaseUid) {
      delete updates.firebaseUid;
    }

    // Don't allow creating superadmin
    if (
      updates.role === "superadmin" &&
      req.dbUser.role !== "superadmin"
    ) {
      delete updates.role;
    }

    // ===================================================================
    // UPDATE USER
    // ===================================================================

    const user = await User.findByIdAndUpdate(
      id,
      {
        ...updates,

        address: {
          street: updates.address?.street,
          number: updates.address?.number,
          city: updates.address?.city,
          state: updates.address?.state,
          country: updates.address?.country,
          postalCode: updates.address?.postalCode,
        },

        image: updates.image,

        updatedAt: new Date(),
      },
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

    // ===================================================================
    // RESPONSE
    // ===================================================================

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        user,
      },
    });
  } catch (error: any) {
    console.error("Update user error:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};

// ==========================
// 💳 PAYMENT SUBSCRIPTION (JWT)
// ==========================
export const paySubscription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.dbUser?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { paymentMethod } = req.body;

    const basePrice = 3000;
    let total = basePrice;
    if (paymentMethod === "moncash") total += basePrice * 0.05;

    const now = new Date();

    user.plan = "basic";
    user.subscriptionStart = now;
    user.subscriptionEnd = new Date(now.setMonth(now.getMonth() + 1));

    await user.save();

    res.json({
      message: "Subscription updated",
      paymentMethod,
      totalPaid: total,
      qrCode: paymentMethod === "moncash" ? `QR-${user._id}-${Date.now()}` : null,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating subscription", error: error.message });
  }
};

// ==========================
// 💳 CREATE PAYMENT (QR)
// ==========================
export const createSubscriptionPayment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.dbUser?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const basePrice = 3000;
    const fee = basePrice * 0.05;
    const total = basePrice + fee;

    const qr = `moncash://pay?amount=${total}&user=${user._id}`;

    res.json({ basePrice, fee, total, qr });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating payment", error: error.message });
  }
};
/**
 * DELETE /api/users/:id
 * Delete user (SuperAdmin only, soft delete)
 * Requires: Firebase Authentication + SuperAdmin Role
 */
export const deleteUserController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // ===================================================================
    // VALIDATION
    // ===================================================================

    if (!req.dbUser) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        error: "NO_AUTH",
      });
    }

    if (req.dbUser.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Only superadmins can delete users",
        error: "FORBIDDEN",
      });
    }

    const { id } = req.params;

    // ===================================================================
    // SOFT DELETE
    // ===================================================================

    const user = await User.findByIdAndUpdate(
      id,
      {
        isActive: false,
        updatedAt: new Date(),
      },
      {
        new: true,
      }
    ).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "NOT_FOUND",
      });
    }

    // ===================================================================
    // RESPONSE
    // ===================================================================

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {
        user,
      },
    });
  } catch (error: any) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};