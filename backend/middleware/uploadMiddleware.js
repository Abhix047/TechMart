import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinaryConfig = cloudinary.config({
  cloud_name: String(process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
  api_key: String(process.env.CLOUDINARY_API_KEY || "").trim(),
  api_secret: String(process.env.CLOUDINARY_API_SECRET || "").trim(),
});

const hasCloudinary =
  Boolean(cloudinaryConfig?.cloud_name) &&
  Boolean(cloudinaryConfig?.api_key) &&
  Boolean(cloudinaryConfig?.api_secret);

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => {
    const fallbackFolder = "techmart";

    return {
      folder: String(process.env.CLOUDINARY_FOLDER || fallbackFolder).trim() || fallbackFolder,
      resource_type: "auto",
    };
  },
});

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.resolve("uploads");
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const base = path
      .basename(file.originalname || "upload", ext)
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "")
      .slice(0, 50);

    const safeBase = base.length > 0 ? base : "upload";
    cb(null, `${safeBase}-${Date.now()}${ext || ""}`);
  },
});

const storage = hasCloudinary ? cloudinaryStorage : diskStorage;

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
