import Asset from "../models/assets";
import Transaction from "../models/transactions";
import backendURL from "../constants/backendURL";
import request from "request";
import { decrypt } from "../services/decrypt";

const getBalanceSheetAnalysis = {
  async operation(req, res) {
    const { accountId } = req.body;
    if (!accountId) res.status(400).json({ message: "Required account id" });
    try {
      let transactionData = await Transaction.find({});
      let data = [];
      transactionData.forEach((item) => {
        item.senderAccount = decrypt(item.senderAccount);
        item.receiverAccount = decrypt(item.receiverAccount);
        item.senderName = decrypt(item.senderName);
        item.receiverName = decrypt(item.receiverName);
        data.push(item);
      });
      transactionData = data;
      const assets = await Asset.find({ accountNumber: req.body.accountId });

      const options = {
        url: `${backendURL}balanceSheet`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactions: transactionData,
          balanceSheet: assets,
          source: req.body.accountId,
        }),
      };
      request.post(options, function (err, httpResponse, body) {
        if (err)
          res.status(500).json({
            message: err.message + "Unable to post request on flask api",
            error: err,
          });
        return res.status(200).json({
          data: JSON.parse(body),
          message: "value generated perfectly",
          error: null,
        });
      });
    } catch (error) {
      return res.status(400).json({
        data: null,
        message: "unable to get balance sheet analysis " + error.message,
        error: error,
      });
    }
  },
};

export default getBalanceSheetAnalysis;
