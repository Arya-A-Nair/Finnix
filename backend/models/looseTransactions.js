const mongoose = require("mongoose");

const looseTransactionSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  date: {
    type: Date,
  },
  senderAccount: {
    type: String,
  },
  senderName: {
    type: String,
  },
  receiverAccount: {
    type: String,
  },
  receiverName: {
    type: String,
  },
  amount: {
    type: Number,
  },
  createdBy: {
    type: String,
  },
});

const LooseTransaction = mongoose.model("LooseTransaction", looseTransactionSchema);

module.exports = LooseTransaction;
