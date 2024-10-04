import User from "../../models/user";
import bcrypt from "bcrypt";

const addAccountController = {
  async operation(req, res) {
    try {
      const { name, email: newUserEmail, role: newUserRole } = req.body;

      const { role, _id } = req.userAccount;

      if (role === "admin") {
        // If admin is trying to create superadmin or admin
        if (newUserRole === "superadmin" || newUserRole === "admin") {
          return res.status(401).json({
            status: 401,
            code: 0,
            data: null,
            message: "Unauthorized",
            error: null,
          });
        }
      }
      const user = await User.findOne({ email: newUserEmail });

      if (user)
        return res.status(409).json({
          status: 409,
          code: 0,
          data: null,
          message: "User already exists",
          error: null,
        });
      const password = Math.random().toString(36).slice(-12);
      const salt = await bcrypt.genSalt(8);
      const hash = await bcrypt.hash(password, salt);
      const newUser = await User.create({
        name,
        email: newUserEmail,
        password: hash,
        role: newUserRole,
        createdBy: _id,
      });

      return res.status(201).json({
        data: newUser,
        message: "User created successfully",
        error: null,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        data: null,
        message: "Internal Server Error",
        error: error,
      });
    }
  },
};

export default addAccountController;
