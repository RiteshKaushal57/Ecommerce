import express from "express";
import { getUserOrders, placeOrder } from "../controller/OrderController.js";
import { isAuthenticated } from "../middleware/auth.js";

const OrderRoute = express.Router();

// Place a new order (requires authentication)
OrderRoute.post("/", isAuthenticated, placeOrder);
OrderRoute.get('/', isAuthenticated, getUserOrders)
export default OrderRoute;
