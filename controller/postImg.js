import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Function to upload an image to Cloudinary
export const uploadImage = async (imageBuffer) => {
  try {
    if (!imageBuffer) {
      throw new Error("No image provided");
    }

    console.log("Uploading Image...");

    // Convert the image buffer to a readable stream and upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "uploads" }, // Save inside Cloudinary folder
        (error, result) => (error ? reject(error) : resolve(result))
      );
      streamifier.createReadStream(imageBuffer).pipe(stream);
    });

    console.log("Cloudinary Upload Result:", result.secure_url);
    return result.secure_url; // Return secure URL
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Upload failed");
  }
};

// export const uploadImage = async (image) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     console.log("Uploading Image:", req.file.originalname);

//     // Convert the image buffer to a readable stream and upload to Cloudinary
//     const result = await new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { folder: "uploads" }, // Save inside Cloudinary folder
//         (error, result) => (error ? reject(error) : resolve(result))
//       );
//       streamifier.createReadStream(req.file.buffer).pipe(stream);
//     });

//     return result.secure_url;
//     // console.log("Cloudinary Upload Result:", result);

//     // // Send response with the Cloudinary URL and version
//     // res.status(200).json({
//     //   message: "Image uploaded successfully",
//     //   imageUrl: result.secure_url,
//     //   publicId: result.public_id,
//     //   version: result.version, // Store version for accurate retrieval
//     // });
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     // res.status(500).json({ error: "Upload failed" });
//   }
// };
