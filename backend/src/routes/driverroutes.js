const express = require("express");
const router = express.Router();
const { getAllBuses, updateLocation, getAllRoutes, searchRoutes } = require("../controllers/drivercontroller");

// @route   GET /api/driver/buses
router.get("/buses", getAllBuses);

// @route   GET /api/driver/routes
router.get("/routes", getAllRoutes);

// @route   GET /api/driver/routes/search?from=StopA&to=StopB
router.get("/search", searchRoutes);

// @route   POST /api/driver/location
router.post("/location", updateLocation);

module.exports = router;
