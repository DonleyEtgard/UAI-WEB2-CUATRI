// ============================================================================
// USER ROUTES - Authentication & User Management
// ============================================================================

import express, { Router } from "express";
import {
  getMeController,
  registerController,
  getUserByIdController,
  listUsersController,
  updateUserController,
  deleteUserController,
  paySubscription, 
  createSubscriptionPayment
} from "./controllers";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import { authorizeSuperadminOnly } from "../../middlewares/authorizeSuperadminOnly";
import { authorizeAdminOrSuperadmin } from "../../middlewares/authorizeAdminOrSuperadmin";

const router: Router = express.Router();

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

/**
 * POST /api/users/register
 * Register new user in MongoDB after Firebase registration
 * No authentication required (called after Firebase auth)
 */
router.post("/register", registerController);

// ============================================================================
// AUTHENTICATED ROUTES
// ============================================================================

/**
 * GET /api/users/me
 * Get current user's profile
 */
router.get("/me", authenticateFirebase, getMeController);

// ============================================================================
// ADMIN ROUTES
// ============================================================================

/**
 * GET /api/users
 * List all users (admin/superadmin only)
 */
router.get(
  "/",
  authenticateFirebase,
  authorizeAdminOrSuperadmin,
  listUsersController
);

/**
 * GET /api/users/:id
 * Get user by ID (admin/superadmin only)
 */
router.get(
  "/:id",
  authenticateFirebase,
  authorizeAdminOrSuperadmin,
  getUserByIdController
);

/**
 * PATCH /api/users/:id
 * Update user profile (user or admin/superadmin)
 */
router.patch(
  "/:id",
  authenticateFirebase,
  updateUserController
);

// ============================================================================
// SUPERADMIN ROUTES
// ============================================================================

/**
 * DELETE /api/users/:id
 * Delete user (superadmin only, soft delete)
 */
router.delete(
  "/:id",
  authenticateFirebase,
  authorizeSuperadminOnly,
  deleteUserController
);

// PAYMENTS
// ==========================
router.post("/pay-subscription", authenticateFirebase, paySubscription);

router.post("/create-payment", authenticateFirebase, createSubscriptionPayment);

export default router;