import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

// 2. Specifications Sub-Schema 
const specificationSchema = new mongoose.Schema({
  name: { type: String, required: true },  
  value: { type: String, required: true }  
}, { _id: false }); 

// 3. Main Product Schema
const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: { type: String, required: true },     
    brand: { type: String, required: true },    
    category: { type: String, required: true }, 
    description: { type: String, required: true },
   images: [
      { type: String, required: true } ],
    // 🔥 DYNAMIC TECH SPECS 🔥
    specifications: [specificationSchema],
    
    // 💰 PRICING & INVENTORY
    price: { type: Number, required: true, default: 0 },
    discountPrice: { type: Number, default: 0 }, 
    countInStock: { type: Number, required: true, default: 0 },
    
    // 🎨 VARIATIONS
    colors: [{ type: String }], 
    isFeatured: { type: Boolean, default: false }, 
    
    // ⭐ REVIEWS & RATINGS
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;