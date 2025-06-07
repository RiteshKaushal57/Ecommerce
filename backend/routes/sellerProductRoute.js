import express from "express";
import upload from "../middleware/upload.js";
import { addProduct, deleteProduct, getAllProducts } from "../controller/sellerProductController.js";

const sellerProductRouter = express.Router();

sellerProductRouter.post(
  "/add-products",
  upload.array("images", 4),
  addProduct
);
sellerProductRouter.get("/all-products", getAllProducts);
sellerProductRouter.delete("/delete-product/:id", deleteProduct);

export default sellerProductRouter;
