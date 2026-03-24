import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.js";

export const protect = asyncHandler(async (req, res, next) => {
  const cookieToken = req.cookies?.jwt;
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const tokensToTry = [bearerToken, cookieToken].filter(Boolean);

  if (tokensToTry.length > 0) {
    for (const token of tokensToTry) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");

        if (!req.user) {
          continue;
        }

        return next();
      } catch (error) {
        // Try the next available auth source before rejecting.
      }
    }
  }

  res.status(401);
  throw new Error("Not authorized");
});
