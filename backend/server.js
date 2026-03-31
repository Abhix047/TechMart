import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { securityHeaders } from "./middleware/securityMiddleware.js";
import { apiRateLimiter } from "./middleware/rateLimitMiddleware.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

connectDB();
const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────

const rawAllowedOrigins = [
  process.env.CLIENT_URLS,
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URLS,
]
  .filter(Boolean)
  .flatMap((v) => v.split(","))
  .map((o) => o.trim())
  .filter(Boolean);

const toOrigin = (value) => {
  try { return new URL(value).origin; } catch { return null; }
};

const allowedOrigins = new Set(
  (rawAllowedOrigins.length > 0 ? rawAllowedOrigins : ["http://localhost:5173"])
    .map(toOrigin)
    .filter(Boolean)
);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  const normalized = toOrigin(origin);
  if (!normalized) return false;
  if (allowedOrigins.has(normalized)) return true;

  try {
    const { hostname } = new URL(normalized);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".vercel.app") ||
      hostname.endsWith(".onrender.com")
    );
  } catch {
    return false;
  }
};

// ── Middleware ─────────────────────────────────────────────────────────────────

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(securityHeaders);
app.use(cors({
  origin: (origin, cb) => isAllowedOrigin(origin) ? cb(null, true) : cb(new Error("Not allowed by CORS")),
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 204,
}));
app.use(apiRateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Static ────────────────────────────────────────────────────────────────────

app.use("/uploads", express.static(path.join(process.cwd(), "/uploads")));

// ── Routes ────────────────────────────────────────────────────────────────────

app.get("/", (req, res) => res.send("API is running..."));

app.use("/api/auth",     userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin",    adminRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/banners",  bannerRoutes);
app.use("/api/offers",   offerRoutes);
app.use("/api/queries",  queryRoutes);
app.use("/api/payment",  paymentRoutes);

// ── Error handlers ────────────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
