import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controller/cartController.js";
import { isAuthenticated } from "../middleware/auth.js";
const CartRouter = express.Router();

CartRouter.get("/", isAuthenticated, getCart);
CartRouter.post("/", isAuthenticated, addToCart);
CartRouter.put("/:productId", isAuthenticated, updateCartItem);
CartRouter.delete("/:productId", isAuthenticated, removeFromCart);

export default CartRouter;
