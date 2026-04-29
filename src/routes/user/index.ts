import express from 'express';
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import { isSuperAdmin } from "../../middlewares/isSuperAdmin";
import { toggleUserStatus } from "./controllers";

import controllers from './controllers';

const router = express.Router();

router.post('/register', controllers.registerUser);
router.post('/login', controllers.loginWithEmailPassword);
router.patch(
  "/:id/toggle-status",
  authenticateFirebase,
  isSuperAdmin,
  toggleUserStatus
); 

export default router;