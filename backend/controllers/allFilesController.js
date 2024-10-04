import Files from "../models/uploadFile";

const allFiles = {
  async operation(req, res) {
    try {
      const filesList = await Files.find();
      return res
        .status(200)
        .json({ message: "Fetch File List sucessful", files: filesList });
    } catch (error) {
      return res.status(500).json({
        message: "Unable to get files",
        error: error,
      });
    }
  },
};

export default allFiles;
