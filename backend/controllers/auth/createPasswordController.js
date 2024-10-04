import User from "../../models/user";
import bcrypt from "bcrypt";

const createPasswordController = {
  async operation(req, res) {
    try {
      const { password, user } = req.body;
      if (!user || !password)
        return res
          .status(400)
          .json({ data: null, message: "Incomplete Credentials", error: null });
      const salt = await bcrypt.genSalt(8);
      const hashedPassword = await bcrypt.hash(password, salt);
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { password: hashedPassword },
        { new: true }
      );

      return res.status(200).json({
        status: 200,
        code: 1,
        user: updatedUser,
        message: "Password created successfully",
        error: null,
      });
    } catch (error) {
      return res.status(500).json({
        data: null,
        message: "Password not created",
        error,
      });
    }
  },
};

export default createPasswordController;
