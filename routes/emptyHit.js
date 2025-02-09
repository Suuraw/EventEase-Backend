import { emptyReq } from "../controller/emptyHit.js";
import express from "express";
const router=express.Router();
router.get("/emptyReq",emptyReq);
export default router;