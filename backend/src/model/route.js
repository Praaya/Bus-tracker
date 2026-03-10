const mongoose = require("mongoose");

const routeSchema = mongoose.Schema(
  {
    routeName: {
      type: String,
      required: true,
      unique: true,
    },
    // The full path of the bus (for drawing lines on the map)
    path: [
      {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    ],
    // Specific bus stops along the route
    stops: [
      {
        stopName: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Route = mongoose.model("Route", routeSchema);

module.exports = Route;
