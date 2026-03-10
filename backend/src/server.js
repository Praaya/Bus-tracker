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

// Socket.io Middleware for Authentication
const jwt = require("jsonwebtoken");
const Driver = require("./model/driver");

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    // If no token, we still allow connection (for dashboard)
    // but we can mark the socket as unauthenticated
    socket.authenticated = false;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.driver = await Driver.findById(decoded.id).select("-password");
    socket.authenticated = true;
    next();
  } catch (err) {
    console.error("Socket Auth Error:", err.message);
    next(new Error("Authentication error"));
  }
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
  console.log("New Connection:", socket.id, socket.authenticated ? `(Driver: ${socket.driver.name})` : "(Public/Dashboard)");

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
    // Only authenticated drivers can emit updates via sockets
    if (!socket.authenticated || !socket.driver) {
      console.log("Unauthorized update-location attempt from:", socket.id);
      return;
    }

    const busId = socket.driver.busId; // Use the ID from the TOKEN, not the payload!

    const normalizedData = {
      busId: busId,
      latitude: data.latitude,
      longitude: data.longitude,
      speed: data.speed || 0,
      lastUpdated: Date.now()
    };

    console.log(`[Driver -> Server] Bus ${busId} (Driver: ${socket.driver.name}) at ${data.latitude}, ${data.longitude}`);
    
    try {
      // Update or Create Bus record in MongoDB
      const updatedBus = await Bus.findOneAndUpdate(
        { busId: busId },
        normalizedData,
        { upsert: true, new: true }
      );

      // BROADCAST to everyone
      io.emit("location-update", updatedBus);
    } catch (error) {
      console.error("Error updating location in DB:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
const os = require("os");

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "0.0.0.0";
};

server.listen(PORT, "0.0.0.0", () => {
  const localIP = getLocalIP();
  console.log(`🚀 SERVER RUNNING ON:`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://${localIP}:${PORT}`);
  console.log(`   Railway: ${process.env.RAILWAY_STATIC_URL || "N/A"}`);
});
