import express from "express";
import upload from "../middleware/upload";
import cloudinary from "../config/cloudinary";
import fs from "fs";

const uploadRouter = express.Router();

uploadRouter.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "forever", // optional: groups images in Cloudinary
    });

    // Remove temp file from server
    fs.unlinkSync(req.file.path);

    // Send Cloudinary URL back to frontend
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: "Image upload failed" });
  }
});

export default uploadRouter;
