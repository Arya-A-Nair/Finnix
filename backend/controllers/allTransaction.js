import Transaction from "../models/transactions";
import { decrypt } from "../services/decrypt";

const AllTransactions = {
  async operation(req, res) {
    try {
      const response = await Transaction.find({});
      const data = [];
      response.forEach((item, i) => {
        item.senderAccount = decrypt(item.senderAccount);
        item.receiverAccount = decrypt(item.receiverAccount);
        item.senderName = decrypt(item.senderName);
        item.receiverName = decrypt(item.receiverName);
        data.push(item);
      });

      return res.status(200).json({
        status: 200,
        code: 1,
        data: { data },
        message: "createOperation response received",
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        data: null,
        message: "Internal Server Error" + error.message,
        error: error,
      });
    }
  },
};

export default AllTransactions;
