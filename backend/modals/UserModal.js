import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    provider: { type: String, default: "local" },
    profilePhoto: { type: String },
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
        quantity: { type: Number, default: 1 },
        selectedSize: { type: String },
        price: { type: Number },
      },
    ],
    isSeller: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const UserModal = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModal;
