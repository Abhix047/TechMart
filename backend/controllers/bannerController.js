import Banner from "../models/banner.js";
import { v2 as cloudinary } from "cloudinary";

// ✅ CREATE
export const createBanner = async (req, res) => {
  try {
    console.log("Create Banner Request:", req.body);
    if (req.file) console.log("File Info:", req.file);

    const { title, subHeading, type, order } = req.body;

    if (!req.file) {
      console.error("Upload Error: No file provided");
      return res.status(400).json({ message: "File required" });
    }

    const banner = await Banner.create({
      title: title || "New Banner",
      subHeading: subHeading || "",
      type: type || "image",
      order: order ? Number(order) : 0,
      media: req.file.path,
    });

    console.log("Banner Created Success:", banner._id);
    res.status(201).json(banner);
  } catch (err) {
    console.error("Banner Create Error:", err);
    res.status(500).json({ message: `Create failed: ${err.message}` });
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

    if (req.body.title !== undefined) banner.title = req.body.title;
    if (req.body.subHeading !== undefined) banner.subHeading = req.body.subHeading;
    if (req.body.order !== undefined) banner.order = Number(req.body.order);
    if (req.body.isActive !== undefined) banner.isActive = req.body.isActive === "true" || req.body.isActive === true;
    if (req.file) banner.media = req.file.path;

    const updated = await banner.save();
    res.json(updated);
  } catch (err) {
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