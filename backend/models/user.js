import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    createdBy: { type: String },
    suspectedAccounts: { type: Array },
  },
  { timestamps: true }
);

const User = mongoose.model("Users", userSchema);

export default User;
