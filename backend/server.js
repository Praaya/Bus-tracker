const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const busLocations = new Map();

io.on("connection", (socket) => {
  // Matching your screenshot logs for clarity
  console.log("✅ Driver/Dashboard Connected:", socket.id);

  // Send currently known locations to any new dashboard
  socket.emit("all-bus-locations", Array.from(busLocations.values()));

  socket.on("update-location", (data) => {
    const busId = data.busId || "Unknown";
    console.log(`[DATA] Bus ${busId} is at ${data.latitude}, ${data.longitude}`);
    
    // Store it
    busLocations.set(busId, {
      ...data,
      timestamp: Date.now()
    });

    // BROADCAST to everyone
    io.emit("location-update", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 SERVER RUNNING AT http://192.168.31.248:${PORT}`);
});
