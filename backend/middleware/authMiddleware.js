import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.js";

// Protect Routes (Check if user is logged in)
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  // Cookie se 'jwt' naam ka token nikalne ki koshish karo
  token = req.cookies.jwt;

  if (token) {
    try {
      // Token ko verify karo apni secret key use karke
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Token verify ho gaya, ab database se user ki details nikalo
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized ");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized");
  }
});

// 2. Admin Middleware (Check if the user is an Admin)
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); 
  } else {
    res.status(401); // 401 means Unauthorized
    throw new Error("Not authorized as an admin");
  }
};