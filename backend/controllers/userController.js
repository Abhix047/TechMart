import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, storeName } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email already registered!");
  }

  // new user create 
  const user = await User.create({
    name,
    email,
    password,
    role: role || "customer", 
    storeName: role === "admin" ? storeName : undefined, 
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
  //login user
});
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
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
    res.status(401); // 401 means Unauthorized
    throw new Error("Wrong email or password !");
  }
});
//logout 
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User successfully logged out" });
});