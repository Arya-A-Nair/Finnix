import mongoose from "mongoose";

const ComplainSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    bankName: { type: String, required: true },
    bankBranch: { type: String, required: true },
    accountNumber: { type: String, required: true },
    aadharNumber: { type: String, required: true },
    typeOfFraud: { type: String, required: true },
    descriptionOfFraud: { type: String, required: true },
    type: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Complain = mongoose.model("Complain", ComplainSchema);

export default Complain;
