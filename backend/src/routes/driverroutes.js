const express = require("express");
const router = express.Router();
const { getAllBuses, updateLocation } = require("../controllers/drivercontroller");

// @route   GET /api/driver/buses
router.get("/buses", getAllBuses);

// @route   POST /api/driver/location
router.post("/location", updateLocation);

module.exports = router;
