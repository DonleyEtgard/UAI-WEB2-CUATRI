import { Router } from "express";
import { getDashboard } from "../dashboard/controllers";
import authenticateFirebase from "../../middlewares/authenticateFirebase";

const router = Router();

router.get("/", authenticateFirebase, getDashboard);

export default router;  