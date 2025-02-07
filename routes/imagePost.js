import express from "express"
import { uploadImage,getImage } from "../controller/postImg.js"
import { upload } from "../middleware/multerConfig.js";
const router=express.Router();
router.post("/uploadImg",upload.single("image"),uploadImage);
router.get("/getImg/:version/:publicId", getImage);
export default router;