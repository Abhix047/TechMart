import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import generateToken, { buildAuthCookieOptions } from "../utils/generateToken.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    res.status(400);
    throw new Error("You cannot delete your own account from this route");
  }

  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const productId = req.params.id;
  const alreadyAdded = user.wishlist.find((id) => id.toString() === productId.toString());

  if (alreadyAdded) {
    // Remove
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId.toString());
  } else {
    // Add
    user.wishlist.push(productId);
  }

  await user.save();
  res.json(user.wishlist);
});
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const userExists = await User.findOne({ email: normalizedEmail });

  if (userExists) {
    res.status(400);
    throw new Error("Email already registered!");
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: "customer",
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      storeName: user.storeName,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data received");
  }
});
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      storeName: user.storeName,
    });
  } else {
    res.status(401);
    throw new Error("Wrong email or password !");
  }
});
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    ...buildAuthCookieOptions(),
    expires: new Date(0),
  });

  res.status(200).json({ message: "User successfully logged out" });
});
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      storeName: user.storeName,
    });
  } else {
    res.status(404);
    throw new Error("User not Found");
  }
});
