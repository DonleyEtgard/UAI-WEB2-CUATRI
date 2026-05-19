import express from "express";
import controllers from "./controllers";
import { toggleUserStatus, getUsers, paySubscription, createSubscriptionPayment, getMe, getUserById } from "./controllers";
import { authenticateJWT } from "../../middlewares/authenticateJWT";
import { authorizeSuperadminOnly, authorizeUserOrSuperadmin } from "../../middlewares/authorizeUserOrSuperadmin";

const router = express.Router();

// ==========================
// AUTH
// ==========================
router.post("/register", controllers.registerUser);
router.post("/login", controllers.loginWithEmailPassword);

// ==========================
// USERS
// ==========================
router.get("/", authenticateJWT, authorizeSuperadminOnly, getUsers);

// usuario autenticado
router.get("/me", authenticateJWT, getMe);

// usuario por id (ownership o superadmin)
router.get("/:id", authenticateJWT, authorizeUserOrSuperadmin, getUserById);



router.patch(
  "/:id/toggle-status",
  authenticateJWT,
  authorizeUserOrSuperadmin,
  toggleUserStatus
);


// ==========================
// 💳 PAYMENTS (FIXED)
// ==========================
router.post(
  "/pay-subscription",
  authenticateJWT,
  paySubscription
);

router.post(
  "/create-payment",
  authenticateJWT,
  createSubscriptionPayment
);


export default router;