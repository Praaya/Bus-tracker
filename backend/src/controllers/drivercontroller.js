const Bus = require("../model/bus");
const Route = require("../model/route");

// @desc    Get all routes
const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find({});
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new route
const createRoute = async (req, res) => {
  const { routeName, routeId, path, stops } = req.body;
  try {
    const route = await Route.create({ routeName, routeId, path, stops });
    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all buses
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find({});
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update bus location (Protected)
const updateLocation = async (req, res) => {
  const { latitude, longitude, speed } = req.body;
  
  // Get busId from the authenticated driver
  const busId = req.driver.busId;

  try {
    const updatedBus = await Bus.findOneAndUpdate(
      { busId },
      { busId, latitude, longitude, speed, lastUpdated: Date.now() },
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

// @desc    Update bus details
// @route   PUT /api/driver/buses/:id
const updateBus = async (req, res) => {
  const { busId, status } = req.body;
  try {
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      { busId, status },
      { new: true }
    );
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a bus
// @route   DELETE /api/driver/buses/:id
const deleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ message: "Bus removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllBuses, updateLocation, getAllRoutes, createRoute, updateBus, deleteBus };
