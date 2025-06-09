import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import connectToDatabase from "./MongodbConnect/connection.js";
import userRouter from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import CartRouter from "./routes/cartRoute.js";
import OrderRoute from "./routes/orderRoute.js";
import sellerProductRouter from "./routes/sellerProductRoute.js";
import passport from "./config/passport.js";
import jwt from "jsonwebtoken";

const forever = express();

forever.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
forever.use(express.json());
forever.use(cookieParser());

// Connect to MongoDB ONCE at startup
connectToDatabase();

forever.get("/", (req, res) => {
  res.send("Welcome to the Forever API");
});

forever.use("/user", userRouter);
forever.use("/products", productRoute);
forever.use("/cart", CartRouter);
forever.use("/orders", OrderRoute);
forever.use("/seller", sellerProductRouter);

// Google OAuth
forever.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
forever.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });
    res.redirect("http://localhost:5173");
  }
);

const PORT = process.env.PORT || 4000;
forever.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
