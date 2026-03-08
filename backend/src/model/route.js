const mongoose = require("mongoose");

const routeSchema = mongoose.Schema(
  {
    routeName: {
      type: String,
      required: true,
      unique: true,
    },
    routeId: {
      type: String,
      required: true,
      unique: true,
    },
    path: [
      {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    ],
    stops: [
      {
        name: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Route = mongoose.model("Route", routeSchema);

module.exports = Route;
