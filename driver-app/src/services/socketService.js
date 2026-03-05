import { io } from "socket.io-client";

// This is your LIVE Railway URL
const SOCKET_URL = "https://bus-tracker-production-c53a.up.railway.app"; 

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    console.log("Connecting Driver App to LIVE server:", SOCKET_URL);
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("✅ Driver App Connected to LIVE Server");
    });

    socket.on("connect_error", (err) => {
      console.log("❌ Connection Error:", err.message);
    });

    socket.on("disconnect", () => {
      console.log("Driver App Disconnected");
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

export const sendLocation = (data) => {
  if (socket && socket.connected) {
    socket.emit("update-location", data);
  } else {
    console.log("⚠️ Cannot send location: Socket not connected");
  }
};
