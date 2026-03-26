import Banner from "../models/banner.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// ✅ CREATE
export const createBanner = async (req, res) => {
  try {
    console.log("Create Banner Payload:", { ...req.body, has_file: !!req.file });

    if (!req.file) {
      return res.status(400).json({ message: "Media file is required" });
    }

    // Manual Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, "techmart/banners");
    console.log("Cloudinary Upload Success:", result.secure_url);

    const { title, subHeading, type, order } = req.body;
    const banner = await Banner.create({
      title,
      subHeading: subHeading || "",
      media: result.secure_url,
      type: type || (req.file.mimetype.startsWith("video") ? "video" : "image"),
      order: Number(order) || 0,
      isActive: true,
    });

    res.status(201).json(banner);
  } catch (err) {
    console.error("Banner Create Error Details:", {
      message: err.message,
      stack: err.stack,
      cloudinary_error: err
    });
    res.status(500).json({ message: "Server Error: " + err.message });
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
      const result = await uploadToCloudinary(req.file.buffer, "techmart/banners");
      updateData.media = result.secure_url;
      updateData.type = updateData.type || (req.file.mimetype.startsWith("video") ? "video" : "image");
    }

    const updated = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("Banner Update Error:", err);
    res.status(500).json({ message: err.message });
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