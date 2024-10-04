import Complain from "../models/complains";

const updateComplaintStatus = {
  async operation(req, res) {
    const { id, status } = req.body;
    try {
      const complaint = await Complain.updateOne(
        { _id: id },
        status ? { type: "accepted" } : { type: "rejected" }
      );
      res.status(200).json({
        message: "Updated Complain Status",
        complains: complaint,
        error: null,
      });
    } catch (error) {
      res.status(500).json({ message: error.message, error: error });
    }
  },
};

export default updateComplaintStatus;
