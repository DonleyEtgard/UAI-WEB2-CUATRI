import express, { Router } from "express";

import {
  getMeController,
  registerController,
  getUserByIdController,
  listUsersController,
  updateUserController,
  deleteUserController,
  paySubscription,
  getPendingPayments,
  approvePayment,
  createSubscriptionPayment,
  toggleUserStateController,
  createEmployeeController

} from "./controllers";

import { authenticateFirebase } from "../../middlewares/authenticateFirebase";

import { authorizeSuperadminOnly } from "../../middlewares/authorizeSuperadminOnly";

import { authorizeAdminOrSuperadmin } from "../../middlewares/authorizeAdminOrSuperadmin";
import { requireVerifiedEmail } from "../../middlewares/requireVerifiedEmail";

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
  requireVerifiedEmail,
  authorizeAdminOrSuperadmin,
  listUsersController
);

router.post(
  "/pay-subscription",
  authenticateFirebase,
  requireVerifiedEmail,
  paySubscription
);

router.get(
  "/payments/pending",
  authenticateFirebase,
  requireVerifiedEmail,
  authorizeSuperadminOnly,
  getPendingPayments
);

router.patch(
  "/:id/toggle-state",
  authenticateFirebase,
   authorizeSuperadminOnly,
  toggleUserStateController
);
router.put(
  "/payments/:id/approve",
  authenticateFirebase,
  requireVerifiedEmail,
  authorizeSuperadminOnly,
  approvePayment
);

/**
 * GET /api/users/:id
 * Get user by ID (admin/superadmin only)
 */
router.get(
  "/:id",
  authenticateFirebase,
  requireVerifiedEmail,
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
  requireVerifiedEmail,
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
  requireVerifiedEmail,
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
  requireVerifiedEmail,
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
  requireVerifiedEmail,
  paySubscription
);

/**
 * POST /api/users/create-payment
 */
router.post(
  "/create-payment",
  authenticateFirebase,
  requireVerifiedEmail,
  createSubscriptionPayment
);

export default router;
