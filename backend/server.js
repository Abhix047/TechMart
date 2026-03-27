import "dotenv/config";
import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import path from "path";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { securityHeaders } from "./middleware/securityMiddleware.js";
import { apiRateLimiter } from "./middleware/rateLimitMiddleware.js";
import cartRoutes from "./routes/cartRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";


connectDB();
const app = express();

const rawAllowedOrigins = [
  process.env.CLIENT_URLS,
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URLS,
]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map((origin) => origin.trim())
  .filter(Boolean);

const normalizeOrigin = (value) => {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const allowedOrigins = new Set(
  (rawAllowedOrigins.length > 0 ? rawAllowedOrigins : ["http://localhost:5173"]).map(normalizeOrigin).filter(Boolean)
);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) return false;
  if (allowedOrigins.has(normalizedOrigin)) return true;

  try {
    const { hostname } = new URL(normalizedOrigin);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".localhost") ||
      hostname === "vercel.app" ||
      hostname.endsWith(".vercel.app") ||
      hostname === "onrender.com" ||
      hostname.endsWith(".onrender.com") ||
      hostname.includes("vercel") ||
      hostname.includes("render")
    );
  } catch {
    return false;
  }
};

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(securityHeaders);
app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 204,
}));
app.use(apiRateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("API is running...");
});
// Yahan hum apne Routes lagayenge baad mein...

app.use("/uploads", express.static(path.join(process.cwd(), "/uploads")));
import Banner from "./models/banner.js";
import { v2 as cloudinary } from "cloudinary";
app.get("/api/test-db", async (req, res) => {
  try {
    const banners = await Banner.find();
    let cloudStatus = "Not Tested";
    try {
      const ping = await cloudinary.api.ping();
      cloudStatus = ping.status;
    } catch (ce) {
      cloudStatus = `Error: ${ce.message}`;
    }
    
    res.json({ 
      success: true, 
      count: banners.length, 
      cloudinary: cloudStatus,
      env: {
        node: process.version,
        env: process.env.NODE_ENV
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/offers", offerRoutes);
// Error middlewares hamesha sabse last mein lagte hain
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
