import mongoose from "mongoose";

const accountHolderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String },
    accountNumber: { type: String, required: true, unique: true },
    isAccountFlaged: { type: Boolean, default: false },
    cvssScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountHolderSchema);

export default Account;
