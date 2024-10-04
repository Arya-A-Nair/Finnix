const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  senderAccount: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  receiverAccount: {
    type: String,
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: String,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
