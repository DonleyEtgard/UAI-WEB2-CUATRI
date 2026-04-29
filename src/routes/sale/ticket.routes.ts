import express from "express";
import { getTicket } from "./ticket.controllers";

const router = express.Router();

router.get("/:id", getTicket);

export default router;