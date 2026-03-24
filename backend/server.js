import express from "express";
import dotenv from "dotenv";
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


dotenv.config();
connectDB();
const app = express();

const allowedOrigins = (process.env.CLIENT_URLS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(securityHeaders);
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || 
        origin.includes("vercel.app") || 
        origin.includes("onrender.com") ||
        origin.includes("localhost")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  credentials: true,
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
