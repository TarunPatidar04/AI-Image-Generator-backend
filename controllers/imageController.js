const openai = require("../config/openai");
const Image = require("../models/imageModel");

// 🧠 Generate & Save Image
exports.generateImage = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "512x512",
    });

    const imageUrl = response.data[0].url;

    const savedImage = await Image.create({ prompt, imageUrl });

    res.status(201).json(savedImage);
  } catch (err) {
    console.error("OpenAI Image Error:", err.message);
    res.status(500).json({ error: "Failed to generate and save image" });
  }
};

// 📦 Get All Images
exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

// ❌ Delete Image by ID
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Image.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Image not found" });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete image" });
  }
};
