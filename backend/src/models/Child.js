import mongoose from "mongoose";

const childSchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    grade: { type: String, required: true },
    school: { type: String, required: true },
    age: { type: Number, default: null },
    specialNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Child", childSchema);
