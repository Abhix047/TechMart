import Banner from "../models/banner.js";

// ✅ CREATE
export const createBanner = async (req, res) => {
  try {
    const { title, type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const banner = await Banner.create({
      title,
      type,
      media: `/uploads/banners/${req.file.filename}`,
    });

    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET (public – only active, max 5 for hero slider)
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).limit(5);
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL (admin – every banner regardless of isActive)
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
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
    if (req.body.isActive !== undefined) banner.isActive = req.body.isActive === "true" || req.body.isActive === true;
    if (req.file) banner.media = `/uploads/banners/${req.file.filename}`;

    const updated = await banner.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE
export const deleteBanner = async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};