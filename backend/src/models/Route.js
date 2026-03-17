import mongoose from "mongoose";

const stopSchema = new mongoose.Schema(
  {
    location: { type: String, required: true },
    pickupTime: { type: String, required: true },
    dropoffTime: { type: String, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    order: { type: Number, required: true },
  },
  { _id: true }
);

const routeSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", default: null },
    name: { type: String, required: true },
    school: { type: String, required: true },
    schoolArrival: { type: String, default: null },
    schoolDeparture: { type: String, default: null },
    stops: [stopSchema],
    daysOfOperation: [{ type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    studentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

routeSchema.index({ status: 1, school: 1 });

export default mongoose.model("Route", routeSchema);
