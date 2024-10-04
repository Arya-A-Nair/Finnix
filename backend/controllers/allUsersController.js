import User from "../models/user";

const allUsers = {
  async operation(req, res) {
    try {
      let users = await User.find();
      users = users.map((user) => {
        const createdBy = users.find((u) => u.id === user.createdBy);
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          updatedAt: user.updatedAt,
          createdBy: createdBy ? createdBy.email : null,
        };
      });
      return res.status(200).json({
        status: 200,
        code: 1,
        data: { users },
        message: "all users recived",
        error: null,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        code: 1,
        data: {},
        message: "Error occured loading users",
        error: error,
      });
    }
  },
};

export default allUsers;
