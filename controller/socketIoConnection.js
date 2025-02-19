import { Server } from "socket.io";
import Event from "../model&&schema/schemaXmodel.js";
// Mock Events Data
// const mockEvents = [
//   {
//     id: "1",
//     name: "Tech Conference 2024",
//     description: "Join us for the biggest tech conference of the year",
//     date: "2024-04-15T09:00:00",
//     category: "Technology",
//     attendeeCount: 250,
//     bannerImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
//     status: "upcoming",
//   },
//   {
//     id: "2",
//     name: "Music Festival",
//     description: "A weekend of amazing live performances",
//     date: "2024-05-20T18:00:00",
//     category: "Music",
//     attendeeCount: 500,
//     bannerImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
//     status: "upcoming",
//   }
// ];

export const connectSocket = (server) => {
  try {
    const io = new Server(server, {
      cors: {
        origin: "*", // Allow frontend connections
      },
    });

    io.on("connection", async(socket) => {
      console.log("A user connected:", socket.id);

      // Send mockEvents to the newly connected client
      try {
        const mockEvents=await Event.find();
        socket.emit("initialEvents", mockEvents);
      } catch (error) {
        
      }

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });

      // Example event emitting
      socket.on("updateAttendee", (data) => {
        // Update the mockEvents array (if needed)
        mockEvents.forEach((event) => {
          if (event.id === data.eventId) {
            event.attendeeCount = data.count;
          }
        });

        // Broadcast updated event to all clients
        io.emit("attendeeUpdate", data);
      });
    });
  } catch (error) {
    console.error("Socket Connection Error:", error);
  }
};
