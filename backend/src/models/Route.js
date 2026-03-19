import mongoose from "mongoose";

const stopSchema = new mongoose.Schema(
  {
    location: { type: String, required: true, trim: true, minlength: 2, maxlength: 180 },
    pickupTime: { type: String, required: true, match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "pickupTime must use HH:MM format"] },
    dropoffTime: {
      type: String,
      default: null,
      validate: {
        validator(value) {
          if (value === null || value === undefined || value === "") {
            return true;
          }
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
        },
        message: "dropoffTime must use HH:MM format",
      },
    },
    latitude: { type: Number, min: -90, max: 90, default: null },
    longitude: { type: Number, min: -180, max: 180, default: null },
    order: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const routeSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", default: null },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    school: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    schoolArrival: {
      type: String,
      default: null,
      validate: {
        validator(value) {
          if (value === null || value === undefined || value === "") {
            return true;
          }
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
        },
        message: "schoolArrival must use HH:MM format",
      },
    },
    schoolDeparture: {
      type: String,
      default: null,
      validate: {
        validator(value) {
          if (value === null || value === undefined || value === "") {
            return true;
          }
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
        },
        message: "schoolDeparture must use HH:MM format",
      },
    },
    stops: [stopSchema],
    daysOfOperation: [{ type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    studentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

routeSchema.index({ status: 1, school: 1 });

routeSchema.path("stops").validate(function validateUniqueStopOrder(stops) {
  if (!Array.isArray(stops)) {
    return true;
  }

  const seen = new Set();
  for (const stop of stops) {
    if (seen.has(stop.order)) {
      return false;
    }
    seen.add(stop.order);
  }
  return true;
}, "Stop order values must be unique within a route");

export default mongoose.model("Route", routeSchema);
