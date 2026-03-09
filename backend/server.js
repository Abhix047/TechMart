import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"; 
import userRoutes from "./routes/userRoutes.js";
dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 
app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Yahan hum apne Routes lagayenge baad mein...
app.use("/api/users", userRoutes);
// Error middlewares hamesha sabse last mein lagte hain
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));