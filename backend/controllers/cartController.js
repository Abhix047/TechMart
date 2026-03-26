import Cart from "../models/cartModel.js";
import Product from "../models/products.js";

/* ADD TO CART */

export const addToCart = async (req, res) => {
  const { productId, quantity, selectedColor, selectedStorage } = req.body;
  const userId = req.user._id;

  // Find if exact variant already exists in cart
  const query = {
    user: userId,
    product: productId
  };

  if (selectedColor) {
    query["selectedColor.name"] = selectedColor.name;
  } else {
    query["selectedColor"] = { $exists: false };
  }

  if (selectedStorage) {
    query["selectedStorage.size"] = selectedStorage.size;
  } else {
    query["selectedStorage"] = { $exists: false };
  }

  let cartItem = await Cart.findOne(query);

  if (cartItem) {
    cartItem.quantity += quantity;
    await cartItem.save();
    return res.json(cartItem);
  }

  const newCart = await Cart.create({
    user: userId,
    product: productId,
    quantity,
    selectedColor,
    selectedStorage
  });

  res.json(newCart);
};
export const getCart = async(req,res)=>{

const cart = await Cart.find({user:req.user._id})
.populate("product");

res.json(cart);

};export const removeCartItem = async(req,res)=>{

await Cart.findByIdAndDelete(req.params.id);

res.json({message:"Item removed"});

};
export const updateCartItem = async (req, res) => {
  try {

    const item = await Cart.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    item.quantity = req.body.quantity;

    await item.save();

    res.json(item);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};