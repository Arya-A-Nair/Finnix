import request from "request";
import Transaction from "../models/transactions";
import backendURL from "../constants/backendURL";
import { decrypt } from "../services/decrypt";

const getReportWithBaseAmountController = {
  async operation(req, res) {
    const { baseFradulentAmount } = req.body;
    try {
      const response = await Transaction.find({});
      let data = [];
      response.forEach((item) => {
        item.senderAccount = decrypt(item.senderAccount);
        item.receiverAccount = decrypt(item.receiverAccount);
        item.senderName = decrypt(item.senderName);
        item.receiverName = decrypt(item.receiverName);
        data.push(item);
      });
      let options = {
        url: `${backendURL}${
          baseFradulentAmount
            ? "reportWithBaseAmount"
            : "getAnalysisWithTransactions"
        }`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          baseFradulentAmount
            ? {
                transactions: data,
                baseAmount: req.body.baseFradulentAmount,
              }
            : {
                transactions: data,
              }
        ),
      };

      request.post(options, function (err, httpResponse, body) {
        if (err)
          return res.status(500).json({
            message: err.message + "Unable to post request on flask api",
            error: err,
          });
        return res.status(200).json({
          data: baseFradulentAmount
            ? {
                ...JSON.parse(body),
                twoUsersWithMostAverageAmount:
                  JSON.parse(body).twoUsersWithMostAverageAmount,
                usersWithHighestFrequency:
                  JSON.parse(body).usersWithHighestFrequency,
                safeTransactions: JSON.parse(JSON.parse(body).safeTransactions),
                fradulentTransaction: JSON.parse(
                  JSON.parse(body).fradulentTransaction
                ),
              }
            : {
                ...JSON.parse(body),
                twoUsersWithMostAverageAmount: JSON.parse(
                  JSON.parse(body).twoUsersWithMostAverageAmount
                ),
                usersWithHighestFrequency: JSON.parse(
                  JSON.parse(body).usersWithHighestFrequency
                ),
              },
          message: "Answer received",
          error: null,
        });
      });
    } catch (error) {
      res.status(500).json({
        message: error.message + "Unable to get transactions",
        error: error,
      });
    }
  },
};

export default getReportWithBaseAmountController;
