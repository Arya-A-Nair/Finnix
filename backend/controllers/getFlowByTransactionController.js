import request from "request";
import backendURL from "../constants/backendURL";
import Transaction from "../models/transactions";
import { decrypt } from "../services/decrypt";

const getFlowByTransactionController = {
  async operation(req, res) {
    const { transactionId } = req.query;

    try {
      let allTransactions = await Transaction.find({});
      let data = [];
      allTransactions.forEach((item) => {
        item.senderAccount = decrypt(item.senderAccount);
        item.receiverAccount = decrypt(item.receiverAccount);
        item.senderName = decrypt(item.senderName);
        item.receiverName = decrypt(item.receiverName);
        data.push(item);
      });
      allTransactions = data;
      const selectedTransaction = allTransactions.find(
        (t) => t._id.toString() === transactionId
      );
      if (!selectedTransaction)
        return res.status(400).json({
          data: null,
          error: "No transaction found",
          message: "Please enter a valid transaction id",
        });
      const options = {
        url: `${backendURL}getGraphByTransaction`,
        body: JSON.stringify({
          transactions: allTransactions,
          transaction: selectedTransaction,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      request.post(options, function (err, httpResponse, body) {
        if (err) console.log(err);
        res.status(200).json({
          data: JSON.parse(body),
          error: null,
          message: "Success",
        });
      });
    } catch (error) {
      res.status(500).json({
        data: null,
        error: error,
        message: "Internal Server Error" + error.message,
      });
    }
  },
};

export default getFlowByTransactionController;
