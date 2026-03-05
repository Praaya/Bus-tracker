const Bus = require("../model/bus");

// @desc    Get all buses
// @route   GET /api/driver/buses
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find({});
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update bus location (REST version for testing)
// @route   POST /api/driver/location
const updateLocation = async (req, res) => {
  const { busId, latitude, longitude, speed } = req.body;

  try {
    const updatedBus = await Bus.findOneAndUpdate(
      { busId },
      { busId, latitude, longitude, speed, lastUpdated: Date.now() },
      { upsert: true, new: true }
    );

    // BROADCAST to Socket.io clients (Dashboard)
    if (req.io) {
      req.io.emit("location-update", updatedBus);
    }

    res.json(updatedBus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllBuses, updateLocation };
