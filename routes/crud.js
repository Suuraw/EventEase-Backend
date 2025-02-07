import express from "express";
import { createEvent } from "../controller/postEvent.js";
const router =express.Router();
router.post("/postEvent",createEvent);
export default router;