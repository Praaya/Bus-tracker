const mongoose = require("mongoose");

const busSchema = mongoose.Schema(
  {
    busId: {
      type: String,
      required: true,
      unique: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    speed: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Bus = mongoose.model("Bus", busSchema);

module.exports = Bus;
