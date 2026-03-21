import asyncHandler from "express-async-handler";
import Offer from "../models/offer.js";
import Product from "../models/products.js";

// Helper function to sync discount prices
const updateProductsForOffer = async (offer) => {
  if (!offer.products || offer.products.length === 0) return;
  const products = await Product.find({ _id: { $in: offer.products } });
  
  for (const p of products) {
    const activeOffer = offer._id;
    const discountPrice = offer.isActive 
      ? Math.round(p.price - (p.price * offer.discountPercentage / 100))
      : 0;
      
    await Product.updateOne(
      { _id: p._id },
      { $set: { activeOffer, discountPrice } }
    );
  }
};

// @desc    Get all offers
// @route   GET /api/offers
// @access  Admin
export const getOffers = asyncHandler(async (req, res) => {
  const offers = await Offer.find({}).populate("products", "name images price discountPrice");
  res.json(offers);
});

// @desc    Create new offer
// @route   POST /api/offers
// @access  Admin
export const createOffer = asyncHandler(async (req, res) => {
  const { name, discountPercentage, isActive, products } = req.body;
  
  const offer = new Offer({ name, discountPercentage, isActive, products: products || [] });
  const createdOffer = await offer.save();

  if (products && products.length > 0) {
    await updateProductsForOffer(createdOffer);
  }

  res.status(201).json(createdOffer);
});

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Admin
export const updateOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) { res.status(404); throw new Error("Offer not found"); }

  const { name, discountPercentage, isActive, products: newProductIds } = req.body;

  offer.name = name ?? offer.name;
  offer.discountPercentage = discountPercentage ?? offer.discountPercentage;
  offer.isActive = isActive !== undefined ? isActive : offer.isActive;
  
  const oldProductIds = offer.products.map(p => p.toString());
  if (newProductIds) {
    offer.products = newProductIds;
  }
  
  const updatedOffer = await offer.save();

  // 1. Unset offer from removed products
  if (newProductIds) {
    const removedIds = oldProductIds.filter(id => !newProductIds.includes(id));
    if (removedIds.length > 0) {
      await Product.updateMany(
        { _id: { $in: removedIds } },
        { $set: { activeOffer: null, discountPrice: 0 } }
      );
    }
  }

  // 2. Recalculate prices for remaining/added products
  await updateProductsForOffer(updatedOffer);

  res.json(updatedOffer);
});

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Admin
export const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) { res.status(404); throw new Error("Offer not found"); }

  // Unset from products
  if (offer.products.length > 0) {
    await Product.updateMany(
      { _id: { $in: offer.products } },
      { $set: { activeOffer: null, discountPrice: 0 } }
    );
  }

  await offer.deleteOne();
  res.json({ message: "Offer deleted" });
});
