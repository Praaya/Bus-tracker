const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Bus = require("./model/bus");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST"]
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
  },
});

// Inject Socket.io into request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/driver", require("./routes/driverroutes"));

io.on("connection", (socket) => {
  console.log("New Connection:", socket.id);

  // Send currently known locations from DB to any new dashboard
  const fetchAllLocations = async () => {
    try {
      const buses = await Bus.find({});
      socket.emit("all-bus-locations", buses);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };
  fetchAllLocations();

  socket.on("update-location", async (data) => {
    const busId = data.busId || data.bus_id;
    if (!busId) return;

    const normalizedData = {
      busId: busId,
      latitude: data.latitude,
      longitude: data.longitude,
      speed: data.speed || 0,
      lastUpdated: Date.now()
    };

    console.log(`[Driver -> Server] Bus ${busId} at ${data.latitude}, ${data.longitude}`);
    
    try {
      // Update or Create Bus record in MongoDB
      const updatedBus = await Bus.findOneAndUpdate(
        { busId: busId },
        normalizedData,
        { upsert: true, new: true }
      );

      // BROADCAST to everyone
      io.emit("location-update", updatedBus);
      console.log(`[Server -> Dashboards] Broadcasted update for ${busId}`);
    } catch (error) {
      console.error("Error updating location in DB:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`SERVER RUNNING AT http://0.0.0.0:${PORT}`);
});
