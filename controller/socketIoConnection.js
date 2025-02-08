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
      console.log("A user connected:", socket.id);
      const userId = socket.handshake.auth.userId;
      console.log("User ID from auth:", userId);

      try {
        // Only send user-specific events initially if userId exists
        if (userId) {
          const userEvents = await Event.find({ creator: userId });
          console.log("Initial user events found:", userEvents.length);
          socket.emit("initialEvents", userEvents);
        } else {
          // If no userId, send all events (for public view)
          const allEvents = await Event.find();
          socket.emit("initialEvents", allEvents);
        }

        // Handle user-specific event requests (for MyEvents)
        socket.on("getMyEvents", async (requestedUserId) => {
          console.log("getMyEvents requested for userId:", requestedUserId);
          try {
            if (!requestedUserId) {
              console.log("No userId provided for getMyEvents");
              socket.emit("error", { message: "User ID is required" });
              return;
            }

            const createdEvents = await Event.find({
              creator: requestedUserId,
            });
            console.log(
              `Found ${createdEvents.length} events for user ${requestedUserId}`
            );

            socket.emit("myEvents", {
              created: createdEvents,
            });
          } catch (error) {
            console.error("Error fetching user events:", error);
            socket.emit("error", { message: "Error fetching your events" });
          }
        });

        // Handle user-specific event requests (for Dashboard)
        socket.on("getUserEvents", async (requestedUserId) => {
          console.log("getUserEvents requested for userId:", requestedUserId);
          try {
            if (!requestedUserId) {
              console.log("No userId provided for getUserEvents");
              socket.emit("error", { message: "User ID is required" });
              return;
            }

            const userEvents = await Event.find({ creator: requestedUserId });
            console.log(
              `Found ${userEvents.length} events for user ${requestedUserId}`
            );

            socket.emit("userEvents", userEvents);
          } catch (error) {
            console.error("Error fetching user events:", error);
            socket.emit("error", { message: "Error fetching user events" });
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

            // Emit to creator only
            if (updatedEvent.creator.toString() === userId) {
              socket.emit("eventUpdate", updatedEvent);
              socket.emit("myEventUpdate", updatedEvent);
            }
          } catch (error) {
            console.error("Error updating event:", error);
            socket.emit("error", { message: "Error updating event" });
          }
        });

       
        // Handle event deletion
        socket.on("deleteEvent", async (eventId) => {
          try {
            console.log(`Deleting event with ID: ${eventId}`);

            const deletedEvent = await Event.findByIdAndDelete(eventId);

            if (!deletedEvent) {
              console.log("Event not found.");
              socket.emit("error", { message: "Event not found" });
              return;
            }

            console.log(`Event deleted: ${eventId}`);

            // Notify all clients to remove the deleted event
            io.emit("MyEventDeleted", eventId);
          } catch (error) {
            console.error("Error deleting event:", error);
            socket.emit("error", { message: "Error deleting event" });
          }
        });

        // Join user-specific room for targeted updates
        if (userId) {
          socket.join(`user:${userId}`);
          console.log(`User ${userId} joined their specific room`);
        }
      } catch (error) {
        console.error("Error in socket connection:", error);
        socket.emit("error", { message: "Server error" });
      }

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        if (userId) {
          socket.leave(`user:${userId}`);
          console.log(`User ${userId} left their specific room`);
        }
      });
    });

    return io;
  } catch (error) {
    console.error("Socket Connection Error:", error);
  }
};

export const getSocketInstance = () => io;
