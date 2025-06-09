import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: [String], required: true },
    subCategory: { type: String, required: true },
    sizes: { type: [String], required: true },
    date: { type: Date, default: Date.now },
    bestseller: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const ProductModel =
  mongoose.models.Products || mongoose.model("Products", productSchema);
export default ProductModel;
