import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
     },
  {
    timestamps: true,
  }
);

const AddressModel = mongoose.models.Address || mongoose.model("Address", AddressSchema);
export default AddressModel;