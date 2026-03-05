const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

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
  console.log("New Connection:", socket.id);

  socket.emit("all-bus-locations", Array.from(busLocations.values()));

  socket.on("update-location", (data) => {
    // Standardizing the ID field just in case
    const busId = data.busId || data.bus_id;
    if (!busId) return;

    const normalizedData = {
      ...data,
      busId: busId, // Ensure it's always busId for the dashboard
      timestamp: data.timestamp || Date.now()
    };

    console.log(`[Driver -> Server] Bus ${busId} at ${data.latitude}, ${data.longitude}`);
    
    busLocations.set(busId, normalizedData);
    io.emit("location-update", normalizedData);
    console.log(`[Server -> Dashboards] Broadcasted update for ${busId}`);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`SERVER RUNNING AT http://0.0.0.0:${PORT}`);
});
