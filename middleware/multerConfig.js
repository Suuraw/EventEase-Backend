import multer from "multer";

const storage = multer.memoryStorage(); // Store file in memory as a buffer
export const upload = multer({ storage });
