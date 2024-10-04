import detectFraud from "../services/detectBankFrauds";
import Transaction from "../models/transactions";
import { decrypt } from "../services/decrypt";

const fraudAccountsController = {
  async operation(req, res) {
    try {
      let transactions = await Transaction.find();
      let data = [];
      transactions.forEach((item) => {
        item.senderAccount = decrypt(item.senderAccount);
        item.receiverAccount = decrypt(item.receiverAccount);
        item.senderName = decrypt(item.senderName);
        item.receiverName = decrypt(item.receiverName);
        data.push(item);
      });
      transactions = data;
      const response = detectFraud(transactions);
      return res.status(200).json({ message: "Success", data: response });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal server error" + error.message });
    }
  },
};

export default fraudAccountsController;
