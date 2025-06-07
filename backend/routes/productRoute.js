import express from "express";
import {
  getProductById,
  getAllProducts
} from "../controller/productController.js";

const productRoute = express.Router();

productRoute.get("/", getAllProducts);
productRoute.get("/:id", getProductById);




export default productRoute