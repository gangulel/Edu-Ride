import mongoose from "mongoose";

const tripStudentSchema = new mongoose.Schema(
  {
    child: { type: mongoose.Schema.Types.ObjectId, ref: "Child", default: null },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    pickupAddress: { type: String, required: true, trim: true, minlength: 5, maxlength: 200 },
    pickupTime: { type: String, default: null },
    parentPhone: { type: String, trim: true, default: null },
    status: {
      type: String,
      enum: ["waiting", "picked-up", "dropped-off", "absent"],
      default: "waiting",
    },
    pickedUpAt: { type: Date, default: null },
    droppedOffAt: { type: Date, default: null },
  },
  { _id: true }
);

const tripSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
    type: { type: String, enum: ["morning", "afternoon"], default: "morning" },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      default: "not-started",
    },
    students: [tripStudentSchema],
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    distance: { type: Number, min: 0, max: 10000, default: 0 },
    duration: { type: Number, min: 0, max: 1440, default: 0 },
  },
  { timestamps: true }
);

tripSchema.index(
  { driver: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: "in-progress",
    },
  }
);
tripSchema.index({ createdAt: -1 });

export default mongoose.model("Trip", tripSchema);
