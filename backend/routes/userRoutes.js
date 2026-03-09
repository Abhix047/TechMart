import express from "express";
import { registerUser } from "../controllers/userController.js";

const router = express.Router();

// Jab bhi koi POST request /api/users par aayegi, toh registerUser function chalega
router.post("/", registerUser);

export default router;
