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

// ✅ GET
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).limit(5);

    res.json(banners); // 🔥 IMPORTANT (array return karna)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE
export const deleteBanner = async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};