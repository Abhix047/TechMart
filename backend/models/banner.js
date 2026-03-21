import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: String,
    media: String,
    type: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);