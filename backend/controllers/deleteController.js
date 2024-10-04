import User from "../models/user";

const deleteOperation = {
  async operation(req, res) {
    try {
      const { id } = req.body;
      const user = await User.findByIdAndDelete(id);
      return res.status(200).json({
        user,
        message: "Deleted User Successfully",
        error: null,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ data: null, message: "Unable to delete user", error: error });
    }
  },
};

export default deleteOperation;
