import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectToDatabase from "./MongodbConnect/connection.js";
import userRouter from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import jwt from "jsonwebtoken";
import productRoute from "./routes/productRoute.js";
import CartRouter from "./routes/cartRoute.js";
import OrderRoute from "./routes/orderRoute.js";

const forever = express();

forever.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
forever.use(express.json());
forever.use(cookieParser());

connectToDatabase
  .then(() => {
    console.log("Connected to MongoDB");

    forever.get("/", (req, res) => {
      res.send("Welcome to the Forever API");
    });

    forever.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

forever.use("/user", userRouter);
forever.use('/products', productRoute)
forever.use('/cart', CartRouter)
forever.use('/orders', OrderRoute)
//Google OAuth
forever.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
forever.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // 1. Generate JWT
    const token = jwt.sign(
      { id: req.user._id }, // Use whatever unique user identifier you have
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 2. Set JWT in a secure, httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour in milliseconds
    });

    // 3. Redirect to your frontend home page
    res.redirect('http://localhost:5173');
  }
);

