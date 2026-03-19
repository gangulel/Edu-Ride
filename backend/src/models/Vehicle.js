import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    make: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    model: { type: String, required: true, trim: true, minlength: 1, maxlength: 80 },
    year: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{4}$/, "Year must be a 4-digit year"],
      validate: {
        validator(value) {
          const year = Number(value);
          const maxYear = new Date().getFullYear() + 1;
          return year >= 1980 && year <= maxYear;
        },
        message: "Year must be between 1980 and next year",
      },
    },
    color: { type: String, trim: true, maxlength: 40, default: null },
    licensePlate: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9 -]{5,12}$/, "Invalid license plate format"],
    },
    vin: {
      type: String,
      default: null,
      uppercase: true,
      trim: true,
      validate: {
        validator(value) {
          if (value === null || value === undefined || value === "") {
            return true;
          }
          return /^[A-HJ-NPR-Z0-9]{11,17}$/.test(value);
        },
        message: "Invalid VIN format",
      },
    },
    vehicleType: { type: String, enum: ["van", "bus", "mini-bus", "sedan"], default: "van" },
    capacity: { type: Number, required: true, min: 1, max: 100 },
    registrationExpiry: { type: Date, default: null },
    insuranceProvider: { type: String, trim: true, maxlength: 120, default: null },
    insurancePolicy: { type: String, trim: true, maxlength: 80, default: null },
    insuranceExpiry: { type: Date, default: null },
    isAC: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
