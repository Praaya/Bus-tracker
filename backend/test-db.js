const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Try to find .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error("❌ ERROR: Cannot find .env file at:", envPath);
  process.exit(1);
}

require('dotenv').config({ path: envPath });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in .env");
  process.exit(1);
}

console.log("🔍 Testing connection to cluster...");

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ SUCCESS: Connected to MongoDB Atlas from this machine!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ FAILURE: Could not connect.");
    console.error("Error Detail:", err.message);
    process.exit(1);
  });
