import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Diagnostic log for live server
console.log("Cloudinary Configured:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? `${process.env.CLOUDINARY_API_KEY.slice(0, 4)}...` : "MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET ? `${process.env.CLOUDINARY_API_SECRET.slice(0, 4)}...` : "MISSING",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isBanner = req.originalUrl.includes("banners");
    const isOffer = req.originalUrl.includes("offers");
    const isProduct = req.originalUrl.includes("products");

    let folder = "techmart/others";
    if (isBanner) folder = "techmart/banners";
    else if (isOffer) folder = "techmart/offers";
    else if (isProduct) folder = "techmart/products";

    const resource_type = file.mimetype.startsWith("video") ? "video" : "image";

    return {
      folder: folder,
      resource_type: resource_type,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "webm", "mp4", "mov", "avi", "mkv"],
    };
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp|webm|mp4|mov|avi|mkv/;

  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype =
    file.mimetype.startsWith("image") ||
    file.mimetype.startsWith("video");

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb("Only images & videos allowed!");
  }
};

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => checkFileType(file, cb),
  limits: { fileSize: 50 * 1024 * 1024 },
});