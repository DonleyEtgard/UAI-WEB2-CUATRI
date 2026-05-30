import express, { Router } from "express";

import {
  getMeController,
  registerController,
  getUserByIdController,
  listUsersController,
  updateUserController,
  deleteUserController,
  paySubscription,
  createSubscriptionPayment,

  createEmployeeController

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
 * Public register
 * ALWAYS creates ADMIN users
 */
router.post(
  "/register",
  registerController
);

// ============================================================================
// AUTHENTICATED ROUTES
// ============================================================================

/**
 * GET /api/users/me
 * Get current user's profile
 */
router.get(
  "/me",
  authenticateFirebase,
  getMeController
);

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
 * Update user profile
 */
router.patch(
  "/:id",
  authenticateFirebase,
  updateUserController
);

/**
 * POST /api/users/employees
 * Create employee
 * Admin/Superadmin only
 */
router.post(
  "/employees",
  authenticateFirebase,
  authorizeAdminOrSuperadmin,
  createEmployeeController
);

// ============================================================================
// SUPERADMIN ROUTES
// ============================================================================

/**
 * DELETE /api/users/:id
 * Delete user (superadmin only)
 */
router.delete(
  "/:id",
  authenticateFirebase,
  authorizeSuperadminOnly,
  deleteUserController
);

// ============================================================================
// PAYMENTS
// ============================================================================

/**
 * POST /api/users/pay-subscription
 */
router.post(
  "/pay-subscription",
  authenticateFirebase,
  paySubscription
);

/**
 * POST /api/users/create-payment
 */
router.post(
  "/create-payment",
  authenticateFirebase,
  createSubscriptionPayment
);

export default router;