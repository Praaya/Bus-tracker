import { io } from "socket.io-client";

// Updated to use your Linux IP
const SOCKET_URL = "http://192.168.31.248:5000"; 

let socket = null;

export const connectSocket = (onUpdate, onAllLocations) => {
  if (!socket) {
    console.log("Dashboard Connecting to:", SOCKET_URL);
    socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("✅ Dashboard connected to Socket.io");
    });

    socket.on("connect_error", (err) => {
      console.log("❌ Dashboard connection error:", err.message);
    });

    socket.on("location-update", (data) => {
      console.log("Received update:", data);
      onUpdate(data);
    });

    socket.on("all-bus-locations", (locations) => {
      console.log("Received initial locations:", locations);
      onAllLocations(locations);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
