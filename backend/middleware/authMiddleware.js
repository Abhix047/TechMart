import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import BlacklistedToken from "../models/blacklistedToken.js";
import { AUTH_COOKIE_NAME } from "../utils/generateToken.js";

export const resolveAuthenticatedUser = async (req) => {
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAME];
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const tokensToTry = [bearerToken, cookieToken].filter(Boolean);

  if (tokensToTry.length > 0) {
    for (const token of tokensToTry) {
      try {
        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted) continue;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");

        if (!req.user) {
          continue;
        }

        return req.user;
      } catch (error) {
        // Try the next available auth source before rejecting.
      }
    }
  }

  req.user = null;
  return null;
};

export const protect = asyncHandler(async (req, res, next) => {
  const user = await resolveAuthenticatedUser(req);
  if (user) {
    return next();
  }

  res.status(401);
  throw new Error("Not authorized");
});
