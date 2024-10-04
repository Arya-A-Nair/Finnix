import Transaction from "../models/transactions";
import { decrypt } from "../services/decrypt";
import { encrypt } from "../services/encrypt";

const getTransactionsForAccount = {
  async operation(req, res) {
    try {
      let { accountNumber } = req.query;
      if (!accountNumber) return res.status(200).json({ data: [] });
      let response = await Transaction.find();
      const data = [];
      response.forEach((item) => {
        item.senderAccount = decrypt(item.senderAccount);
        item.receiverAccount = decrypt(item.receiverAccount);
        item.senderName = decrypt(item.senderName);
        item.receiverName = decrypt(item.receiverName);
        data.push(item);
      });
      response = data;
      response = response.filter(
        (t) =>
          t.senderAccount === accountNumber ||
          t.receiverAccount === accountNumber
      );
      if (response.length === 0) {
        return res.status(404).json({
          data: [],
          message: "No transactions found",
          error: "Please enter a valid account number",
        });
      } else {
        return res.status(200).json({
          data: response,
          message: "Transactions fetched successfully",
          error: null,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        data: null,
        message: "Internal Server Error" + error.message,
        error: error,
      });
    }
  },
};

export default getTransactionsForAccount;
