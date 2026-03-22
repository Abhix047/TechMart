import mongoose from "mongoose";

const offerSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    discountPercentage: { type: Number, required: true, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);
export default Offer;
