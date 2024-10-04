import Complain from "../models/complains";

const getCompalins = {
  async operation(req, res) {
    try {
      const allComplains = await Complain.find({
        $or: [{ type: "pending" }, { type: "accepted" }],
      });
      res.status(200).json({
        message: "All Complains",
        complains: allComplains,
        error: null,
      });
    } catch (error) {
      res.status(500).json({ message: error.message, error: error });
    }
  },
};

export default getCompalins;
