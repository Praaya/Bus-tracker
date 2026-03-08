import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

// This is your LIVE Railway URL
const SOCKET_URL = "https://bus-tracker-production-c53a.up.railway.app"; 

let socket = null;

export const connectSocket = async () => {
  if (!socket) {
    // Get token from storage
    const storedUser = await AsyncStorage.getItem("driverInfo");
    const token = storedUser ? JSON.parse(storedUser).token : null;

    console.log("Connecting Driver App with Auth Token:", token ? "Yes" : "No");
    
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      auth: {
        token: token
      }
    });

    socket.on("connect", () => {
      console.log("✅ Driver App Connected with AUTH");
    });

    socket.on("connect_error", (err) => {
      console.log("❌ Socket Auth Error:", err.message);
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
    // We don't even need to send busId anymore, the server knows who we are!
    socket.emit("update-location", data);
  } else {
    console.log("⚠️ Cannot send location: Socket not connected");
  }
};
