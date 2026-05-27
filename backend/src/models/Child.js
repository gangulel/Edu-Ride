import mongoose from "mongoose";

const childSchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    grade: {
      type: String,
      required: true,
      enum: [
        "Pre-K",
        "KG",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
      ],
    },
    school: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    age: { type: Number, min: 3, max: 25, default: null },
    gender: { type: String, enum: ['Male', 'Female'], default: null },
    emergencyContact1: { type: String, trim: true, maxlength: 20, default: null },
    emergencyContact2: { type: String, trim: true, maxlength: 20, default: null },
    specialNotes: { type: String, trim: true, maxlength: 500, default: "" },
    homeAddress:  { type: String, trim: true, maxlength: 300, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Child", childSchema);
