const axios = require('axios');

const API_URL = 'http://localhost:5000/api/driver/location';
const BUS_ID = 'SIMULATOR-01';

// A simple path of coordinates (Guwahati area)
const route = [
  { lat: 26.152, lng: 91.885 },
  { lat: 26.155, lng: 91.888 },
  { lat: 26.158, lng: 91.890 },
  { lat: 26.161, lng: 91.892 },
  { lat: 26.164, lng: 91.895 },
  { lat: 26.167, lng: 91.898 },
  { lat: 26.170, lng: 91.900 },
  { lat: 26.173, lng: 91.902 },
  { lat: 26.176, lng: 91.905 },
  { lat: 26.179, lng: 91.908 },
];

let currentIndex = 0;

const sendUpdate = async () => {
  if (currentIndex >= route.length) {
    console.log("🏁 Route finished. Restarting...");
    currentIndex = 0;
  }

  const { lat, lng } = route[currentIndex];
  
  try {
    const response = await axios.post(API_URL, {
      busId: BUS_ID,
      latitude: lat,
      longitude: lng,
      speed: 40 + Math.random() * 10
    });
    
    console.log(`[SIMULATOR] Sent: ${BUS_ID} @ ${lat}, ${lng} - Status: ${response.status}`);
    currentIndex++;
  } catch (error) {
    console.error(`[SIMULATOR] Error: ${error.message}`);
  }
};

console.log("🚀 Starting Bus Simulator...");
setInterval(sendUpdate, 2000);
