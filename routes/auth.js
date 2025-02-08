import express from "express";
import { login } from "../controller/login.js";
import { register } from "../controller/register.js";
const router =express.Router();
router.post("/login",login);
router.post("/register",register);
export default router;