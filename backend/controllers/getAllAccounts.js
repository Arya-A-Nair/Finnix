import Transaction from "../models/transactions";
import { decrypt } from "../services/decrypt";

const getAllAccounts = {
  async operation(req, res) {
    try {
      let sender = await Transaction.find({});
      let receiver = await Transaction.find({});
      let data = [];
      sender.forEach((item) => {
        item.senderAccount = decrypt(item.senderAccount);
        item.receiverAccount = decrypt(item.receiverAccount);
        item.senderName = decrypt(item.senderName);
        item.receiverName = decrypt(item.receiverName);
        data.push(item);
      });
      sender = data.map((t) => t.senderAccount);
      receiver.forEach((item) => {
        item.senderAccount = decrypt(item.senderAccount);
        item.receiverAccount = decrypt(item.receiverAccount);
        item.senderName = decrypt(item.senderName);
        item.receiverName = decrypt(item.receiverName);
        data.push(item);
      });
      receiver = data.map((t) => t.senderAccount);

      const set = new Set();

      for (let i = 0; i < sender.length; i++) {
        set.add(sender[i]);
      }

      for (let i = 0; i < receiver.length; i++) {
        set.add(receiver[i]);
      }
      console.log(set);
      return res.status(200).json({
        status: 200,
        code: 1,
        data: [...set],
        message: "createOperation response received",
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        code: 0,
        data: null,
        message: error.message,
        error: error,
      });
    }
  },
};

export default getAllAccounts;
