import express from "express";
import { getTicket } from "./ticket.controllers";
import { authenticateFirebase } from '../../middlewares/authenticateFirebase';

const router = express.Router();

router.get("/:id", authenticateFirebase, getTicket);

export default router;