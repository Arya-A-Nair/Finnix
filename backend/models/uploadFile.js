import mongoose from "mongoose";

const uploadFileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fileType: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    userId: { type: String, required: true },
    allowedAdmins: { type: Array, default: [] },
    isGeneratedData: { type: Boolean, default: false },
    fileCategory: { type: String },
  },
  { timestamps: true }
);

const UploadFile = mongoose.model("Files", uploadFileSchema);

export default UploadFile;
