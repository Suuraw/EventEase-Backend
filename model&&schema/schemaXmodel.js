import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    enum: ["Music", "Sports", "Conference", "Exhibition", "Workshop", "Other"],
    required: true,
  },
  attendeeCount: {
    type: Number,
    default: 0, // Default is 0 if no attendees yet
  },
  bannerImage: {
    type: String, // URL of the event banner image
    required: true,
  },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "cancelled"],
    default: "upcoming",
  },
  location: {
    type: String,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

export default Event;