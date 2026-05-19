import express from "express";
import { getTicket } from "./ticket.controllers";
import { authenticateJWT } from '../../middlewares/authenticateJWT';

const router = express.Router();

router.get("/:id", getTicket);

export default router;