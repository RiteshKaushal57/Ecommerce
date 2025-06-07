// controllers/productController.js
import cloudinary from "../config/cloudinary.js";
import ProductModel from "../modals/ProductModel.js";

// Helper function for Cloudinary upload
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Controller function
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      offerPrice,
      bestseller,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !subCategory ||
      !sizes ||
      !req.files ||
      req.files.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Always ensure sizes is an array (even if only one size is selected)
    let sizesArray = sizes;
    if (!Array.isArray(sizesArray)) {
      sizesArray = [sizesArray];
    }

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    // Save product to DB
    const product = await ProductModel.create({
      name,
      description,
      price,
      category,
      subCategory,
      sizes: sizesArray,
      offerPrice,
      bestseller: bestseller || false,
      image: imageUrls,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({});
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching all products in backend",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductModel.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
