import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String },
    accountNumber: { type: String },
    createdBy: { type: String },
  },
  { timestamps: true }
);

const Asset = mongoose.model("Assets", AssetSchema);

export default Asset;
