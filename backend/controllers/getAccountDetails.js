import Transaction from "../models/transactions";
import backendURL from "../constants/backendURL";
import request from "request";
import { decrypt } from "../services/decrypt";
import Account from "../models/accountHolder";

const getAccountDetails = {
  async operation(req, res) {
    try {
      let { accountNumber } = req.query;
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
      console.log("accountNumber", accountNumber);
      let depositTransactions = allTransactions.filter(
        (t) => t.receiverAccount === accountNumber
      );
      let withDrawlTransactions = allTransactions.filter(
        (t) => t.senderAccount === accountNumber
      );
      console.log(depositTransactions, withDrawlTransactions);

      const totalAmountDeposited = depositTransactions.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
      const totalAmountWithDrawn = withDrawlTransactions.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
      let account = {};

      if (depositTransactions.length > 0) {
        account = {
          name: depositTransactions[0].receiverName,
          accountNumber: depositTransactions[0].receiverAccount,
        };
      } else if (withDrawlTransactions.length > 0) {
        account = {
          name: withDrawlTransactions[0].senderName,
          accountNumber: withDrawlTransactions[0].senderAccount,
        };
      }
      // account = await Account.findOne({ accountNumber: accountNumber });
      console.log(await Account.findOne({ accountNumber: accountNumber }));
      const options = {
        url: `${backendURL}findAccountFraud`,
        body: JSON.stringify({
          account: accountNumber,
          transactions: allTransactions,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      request.post(options, function (err, httpResponse, body) {
        if (err) console.log(err);
        res.status(200).json({
          details: {
            totalWithdrawls: depositTransactions.length,
            totalDeposits: withDrawlTransactions.length,
            account: account,
            totalTransactions:
              depositTransactions.length + withDrawlTransactions.length,
            totalAmountDeposited: totalAmountDeposited,
            totalAmountWithDrawn: totalAmountWithDrawn,
            cvssScore: 5,
            isAccountFlaged: JSON.parse(body).frauds.length > 0,
            frauds: JSON.parse(body).frauds,
            score: JSON.parse(body).score,
          },
        });
      });
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
export default getAccountDetails;
