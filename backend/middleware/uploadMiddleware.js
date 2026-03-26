import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
  api_key: (process.env.CLOUDINARY_API_KEY || "").trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || "").trim(),
});

// Diagnostic log for live server
const rawSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();
console.log("Cloudinary Configured:", {
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
  api_key_status: process.env.CLOUDINARY_API_KEY ? `Configured (Length: ${process.env.CLOUDINARY_API_KEY.trim().length})` : "MISSING",
  api_secret_debug: rawSecret ? `Starts with: [${rawSecret[0]}] Ends with: [${rawSecret.slice(-1)}] Length: ${rawSecret.length}` : "MISSING",
  has_url: !!process.env.CLOUDINARY_URL,
});

const storage = multer.memoryStorage();

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp|webm|mp4|mov|avi|mkv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith("image") || file.mimetype.startsWith("video");

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images & videos allowed!"));
  }
};

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => checkFileType(file, cb),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});