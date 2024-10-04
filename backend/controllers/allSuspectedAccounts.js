import Account from "../models/accountHolder";
import User from "../models/user";

const allSuspectedAccounts = {
  async operation(req, res) {
    try {
      let suspectedAccountsByUser = [];
      const { _id: id } = req.userAccount;
      let user = await User.findOne({ _id: id });
      user = user.suspectedAccounts;
      user.forEach(async (account) => {
        const accountDetail = await Account.findOne({
          accountNumber: `${account}`,
        });
        suspectedAccountsByUser.push(accountDetail);
      });

      console.log(suspectedAccountsByUser);
      res.status(200).send({
        message: "Account fetched successfully",
        suspectedAccounts: suspectedAccountsByUser,
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Internal server error" + error.message });
    }
  },
};

export default allSuspectedAccounts;
