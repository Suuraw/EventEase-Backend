// myEventsSocket.js
import { Server } from "socket.io";
import Event from "../model&&schema/schemaXmodel.js";

let io;

export const connectSocket = (server) => {
  try {
    io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", async (socket) => {
      console.log("A user connected to MyEvents:", socket.id);
      const userId = socket.handshake.auth.userId;

      try {
        // Handle initial user-specific events fetch
        socket.on("getMyEvents", async (userId) => {
          try {
            // Find events where the user is the creator
            const createdEvents = await Event.find({ creator: userId });
            socket.emit("myEvents", {
              created: createdEvents,
            });
          } catch (error) {
            console.error("Error fetching user events:", error);
            socket.emit("error", { message: "Error fetching your events" });
          }
        });

        // Handle event updates
        socket.on("eventUpdate", async (eventData) => {
          try {
            const updatedEvent = await Event.findByIdAndUpdate(
              eventData._id,
              eventData,
              { new: true }
            );
            
            // Emit to all clients watching this event
            io.emit("eventUpdate", updatedEvent);
            
            // Emit specifically to the event creator
            io.to(`user:${updatedEvent.creator}`).emit("myEventUpdate", updatedEvent);
          } catch (error) {
            console.error("Error updating event:", error);
            socket.emit("error", { message: "Error updating event" });
          }
        });

        // Handle event deletion
        socket.on("deleteEvent", async (eventId) => {
          try {
            const deletedEvent = await Event.findByIdAndDelete(eventId);
            if (deletedEvent) {
              // Notify all clients about the deletion
              io.emit("eventDeleted", eventId);
              // Notify the creator specifically
              io.to(`user:${deletedEvent.creator}`).emit("myEventDeleted", eventId);
            }
          } catch (error) {
            console.error("Error deleting event:", error);
            socket.emit("error", { message: "Error deleting event" });
          }
        });

      } catch (error) {
        console.error("Error in socket connection:", error);
        socket.emit("error", { message: "Server error" });
      }

      // Join user-specific room for targeted updates
      if (userId) {
        socket.join(`user:${userId}`);
      }

      socket.on("disconnect", () => {
        console.log("User disconnected from MyEvents:", socket.id);
        if (userId) {
          socket.leave(`user:${userId}`);
        }
      });
    });

    return io;
  } catch (error) {
    console.error("Socket Connection Error:", error);
  }
};

export const getSocketInstance = () => io;