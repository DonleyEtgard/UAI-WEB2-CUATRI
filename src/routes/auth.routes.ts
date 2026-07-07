import { Router } from "express";
import { authenticateFirebase } from "../middlewares/authenticateFirebase";

const router = Router();

router.get(
  "/me",
  authenticateFirebase,
  async (req: any, res) => {
    return res.json({
      user: req.dbUser,
    });
  }
);

export default router;