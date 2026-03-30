import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import generateToken, { AUTH_COOKIE_NAME, buildAuthCookieOptions } from "../utils/generateToken.js";
import { resolveAuthenticatedUser } from "../middleware/authMiddleware.js";

const serializeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  storeName: user.storeName,
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  if (await User.findOne({ email: normalizedEmail })) {
    res.status(400);
    throw new Error("Email already registered!");
  }

  const user = await User.create({ name: name.trim(), email: normalizedEmail, password, role: "customer" });
  const token = generateToken(req, res, user._id);
  res.status(201).json({ token, ...serializeUser(user) });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Wrong email or password!");
  }

  const token = generateToken(req, res, user._id);
  res.json({ token, ...serializeUser(user) });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie(AUTH_COOKIE_NAME, "", { ...buildAuthCookieOptions(req), maxAge: 0, expires: new Date(0) });
  res.json({ message: "User successfully logged out" });
});

export const getAuthSession = asyncHandler(async (req, res) => {
  const user = await resolveAuthenticatedUser(req);
  if (!user) return res.json({ authenticated: false, user: null });
  return res.json({ authenticated: true, user: serializeUser(user) });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  res.json(serializeUser(user));
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    res.status(400);
    throw new Error("You cannot delete your own account from this route");
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  res.json({ message: "User removed" });
});

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  if (!user) { res.status(404); throw new Error("User not found"); }
  res.json(user.wishlist);
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error("User not found"); }

  const productId = req.params.id;
  const already = user.wishlist.some(id => id.toString() === productId);

  user.wishlist = already
    ? user.wishlist.filter(id => id.toString() !== productId)
    : [...user.wishlist, productId];

  await user.save();
  res.json(user.wishlist);
});
