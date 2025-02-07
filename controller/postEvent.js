import multer from "multer";
import { uploadImage } from "./postImg.js";
import Event from "../model&&schema/schemaXmodel.js";
import { upload } from "../middleware/multerConfig.js";

export const createEvent = [
  upload.single("bannerImage"),
  async (req, res) => {
    try {
      const { name, description, date, category, attendeeCount, status } = req.body;

      // Validate required fields
      if (!name || !description || !date || !category || !attendeeCount || !status) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Handle image upload
      let imageUrl;
      if (req.file) {
        imageUrl = await uploadImage(req.file.buffer); // Upload to Cloudinary
      } else if (req.body.bannerImage && req.body.bannerImage.startsWith("https")) {
        imageUrl = req.body.bannerImage; // Use URL if provided
      } else {
        return res.status(400).json({ error: "Banner image is required (file or URL)" });
      }

      // Save to database
      const newEvent = new Event({
        name,
        description,
        date,
        category,
        attendeeCount: parseInt(attendeeCount, 10),
        bannerImage: imageUrl,
        status,
      });

      await newEvent.save();
      res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];
