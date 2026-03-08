const express = require("express");
const router = express.Router();
const { 
  getAllBuses, 
  updateLocation, 
  getAllRoutes, 
  createRoute, 
  updateBus, 
  deleteBus 
} = require("../controllers/drivercontroller");
const { protect } = require("../middleware/authmiddleware");

// Public routes
router.get("/buses", getAllBuses);
router.get("/routes", getAllRoutes);

// Protected routes (Only logged-in drivers)
router.post("/location", protect, updateLocation);

// Admin only
router.post("/routes", createRoute);
router.put("/buses/:id", updateBus);
router.delete("/buses/:id", deleteBus);

module.exports = router;
