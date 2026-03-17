import mongoose from "mongoose";

const adminContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true, default: "default" },
    ratings: { type: mongoose.Schema.Types.Mixed, default: {} },
    reports: { type: mongoose.Schema.Types.Mixed, default: {} },
    complaints: { type: [mongoose.Schema.Types.Mixed], default: [] },
    audit: { type: mongoose.Schema.Types.Mixed, default: {} },
    communication: { type: mongoose.Schema.Types.Mixed, default: {} },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("AdminContent", adminContentSchema);
