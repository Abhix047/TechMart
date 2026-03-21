import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (req.originalUrl.includes("banners")) {
      cb(null, "uploads/banners/");
    } else {
      cb(null, "uploads/");
    }
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
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