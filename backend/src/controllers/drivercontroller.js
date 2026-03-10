const Bus = require("../model/bus");
const Route = require("../model/route");

// @desc    Get all buses
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find({});
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all routes (for searching)
const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find({});
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Find routes by stops
const searchRoutes = async (req, res) => {
  const { from, to } = req.query; // Stop names

  try {
    // Find routes that contain both stops
    const foundRoutes = await Route.find({
      "stops.stopName": { $all: [from, to] }
    });
    
    // Find all active buses currently on those routes
    const routeNames = foundRoutes.map(r => r.routeName);
    const activeBuses = await Bus.find({ routeName: { $in: routeNames } });

    res.json({
      routes: foundRoutes,
      buses: activeBuses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update bus location
const updateLocation = async (req, res) => {
  const { busId, routeName, latitude, longitude, speed } = req.body;

  try {
    const updatedBus = await Bus.findOneAndUpdate(
      { busId },
      { busId, routeName, latitude, longitude, speed, lastUpdated: Date.now() },
      { upsert: true, new: true }
    );

    if (req.io) {
      req.io.emit("location-update", updatedBus);
    }

    res.json(updatedBus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllBuses, getAllRoutes, searchRoutes, updateLocation };
