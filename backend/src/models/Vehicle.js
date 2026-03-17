import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: String, required: true },
    color: { type: String, default: null },
    licensePlate: { type: String, required: true, unique: true },
    vin: { type: String, default: null },
    vehicleType: { type: String, enum: ["van", "bus", "mini-bus", "sedan"], default: "van" },
    capacity: { type: Number, required: true },
    registrationExpiry: { type: Date, default: null },
    insuranceProvider: { type: String, default: null },
    insurancePolicy: { type: String, default: null },
    insuranceExpiry: { type: Date, default: null },
    isAC: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
