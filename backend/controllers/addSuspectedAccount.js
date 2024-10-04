import User from "../models/user";

const addSuspectedAccount = {
  async operation(req, res) {
    try {
      const { accountNumber } = req.query;
      if (!accountNumber)
        res.status(400).send({ message: "Account number is required" });
      const { _id: id } = req.userAccount;
      const response = await User.findByIdAndUpdate(id, {
        $push: { suspectedAccounts: accountNumber },
      });
      res.status(200).send({ message: "Account added successfully" });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Internal server error" + error.message });
    }
  },
};

export default addSuspectedAccount;
