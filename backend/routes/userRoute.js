import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  becomeSeller,
} from "../controller/userController.js";
import { isAuthenticated } from "../middleware/auth.js";
import UserModal from "../modals/UserModal.js";

const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.patch("/become-seller",isAuthenticated, becomeSeller);

userRouter.get("/auth", isAuthenticated, async (req, res) => {
  try {
    const user = await UserModal.findById(req.user.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default userRouter;
