import Cart from "../models/cartModel.js";

export const addToCart = async (req, res) => {
  const { productId, quantity, selectedColor, selectedStorage } = req.body;
  const userId = req.user._id;

  // Build query to find existing variant in cart
  const query = { user: userId, product: productId };

  if (selectedColor) query["selectedColor.name"] = selectedColor.name;
  else query["selectedColor"] = { $exists: false };

  if (selectedStorage) query["selectedStorage.size"] = selectedStorage.size;
  else query["selectedStorage"] = { $exists: false };

  const existing = await Cart.findOne(query);
  if (existing) {
    existing.quantity += quantity;
    return res.json(await existing.save());
  }

  const item = await Cart.create({ user: userId, product: productId, quantity, selectedColor, selectedStorage });
  res.json(item);
};

export const getCart = async (req, res) => {
  const cart = await Cart.find({ user: req.user._id }).populate("product");
  res.json(cart);
};

export const removeCartItem = async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.json({ message: "Item removed" });
};

export const updateCartItem = async (req, res) => {
  const item = await Cart.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Cart item not found" });

  item.quantity = req.body.quantity;
  res.json(await item.save());
};