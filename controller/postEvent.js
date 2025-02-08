import { uploadImage } from "./postImg.js";
import Event from "../model&&schema/schemaXmodel.js";
import { upload } from "../middleware/multerConfig.js";
import { getSocketInstance } from "./socketIoConnection.js"; // Import io instance

export const createEvent = [
  upload.single("bannerImage"),
  async (req, res) => {
    try {
      const { name, description, date, category, attendeeCount, status,location,creator } =
        req.body;

      if (
        !name ||
        !description ||
        !date ||
        !category ||
        !attendeeCount ||
        !status
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }

      let imageUrl;
      if (req.file) {
        imageUrl = await uploadImage(req.file.buffer);
      } else if (
        req.body.bannerImage &&
        req.body.bannerImage.startsWith("https")
      ) {
        imageUrl = req.body.bannerImage;
      } else {
        return res.status(400).json({ error: "Banner image is required" });
      }

      const newEvent = new Event({
        name,
        description,
        date,
        category,
        attendeeCount: parseInt(attendeeCount, 10),
        bannerImage: imageUrl,
        status,
        location,
        creator
      });

      await newEvent.save();

      // Emit new event to all clients
      const io = getSocketInstance();
      if (io) {
        io.emit("newEvent", newEvent);
      }

      res
        .status(201)
        .json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];
