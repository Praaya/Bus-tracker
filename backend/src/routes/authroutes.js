const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Driver = require("../model/driver");

// @desc    Auth driver & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const driver = await Driver.findOne({ email });

    if (driver && (await driver.matchPassword(password))) {
      res.json({
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        busId: driver.busId,
        token: jwt.sign({ id: driver._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        }),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Register a new driver
// @route   POST /api/auth/register
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password, busId } = req.body;

  try {
    const driverExists = await Driver.findOne({ email });

    if (driverExists) {
      return res.status(400).json({ message: "Driver already exists" });
    }

    const driver = await Driver.create({
      name,
      email,
      password,
      busId,
    });

    if (driver) {
      res.status(201).json({
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        busId: driver.busId,
        token: jwt.sign({ id: driver._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        }),
      });
    } else {
      res.status(400).json({ message: "Invalid driver data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
