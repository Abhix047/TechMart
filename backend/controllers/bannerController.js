import Banner from "../models/banner.js";

const resolveUploadedFileUrl = (file) => {
  if (!file) return "";

  if (typeof file.secure_url === "string" && file.secure_url.trim().length > 0) {
    return file.secure_url.trim();
  }

  if (typeof file.url === "string" && file.url.trim().length > 0) {
    return file.url.trim();
  }

  if (typeof file.path === "string" && file.path.trim().length > 0) {
    const trimmed = file.path.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;

    const normalized = trimmed.replace(/\\/g, "/");
    if (normalized.startsWith("uploads/")) return `/${normalized}`;

    const uploadsIdx = normalized.lastIndexOf("/uploads/");
    if (uploadsIdx !== -1) return normalized.slice(uploadsIdx);
  }

  if (typeof file.filename === "string" && file.filename.trim().length > 0) {
    return `/uploads/${file.filename.trim()}`;
  }

  return "";
};

// ✅ CREATE
export const createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Media file is required" });
    }

    const mediaUrl = resolveUploadedFileUrl(req.file);
    if (!mediaUrl) {
      return res.status(500).json({ message: "Upload succeeded but no media URL was produced" });
    }

    const { title, subHeading, type, order } = req.body;
    const banner = await Banner.create({
      title,
      subHeading: subHeading || "",
      media: mediaUrl,
      type: type || (req.file.mimetype?.startsWith("video") ? "video" : "image"),
      order: Number(order) || 0,
      isActive: true,
    });

    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ 
      message: "Server Error: " + err.message,
      error: err,
      location: "createBanner"
    });
  }
};

// ✅ GET (public – only active, max 5 for hero slider)
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).limit(5);
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL (admin – every banner regardless of isActive)
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE (title + optional new media)
export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    const updateData = { ...req.body };

    // If a new file is uploaded
    if (req.file) {
      const mediaUrl = resolveUploadedFileUrl(req.file);
      if (mediaUrl) {
        updateData.media = mediaUrl;
      }
      updateData.type = updateData.type || (req.file.mimetype?.startsWith("video") ? "video" : "image");
    }

    const updated = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("Banner Update Error:", err);
    res.status(500).json({ 
      message: err.message,
      error: err,
      location: "updateBanner"
    });
  }
};

// ✅ GET SINGLE
export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DIAGNOSTICS
export const getBannerStatus = async (req, res) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const isCloudConfigured = !!(cloudName && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
    
    // Check Mongo Connection
    const mongoStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

    res.json({
      status: "OK",
      mongodb: mongoStatus,
      cloudinary: {
        configured: isCloudConfigured,
        cloudName: cloudName ? `${cloudName.slice(0, 3)}...` : "Not Found",
      },
      environment: process.env.NODE_ENV || "Not Set",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
