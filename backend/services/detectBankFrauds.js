const bankAccountsCSV = 
`id,accountNumber,name,openingTime
1,918343949760,Dev Shah,2023-05-04
2,38343949760,Ashwini Dalvi,2023-05-07`;

function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  const header = lines[0].split(",");
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const entry = {};

    for (let j = 0; j < header.length; j++) {
      entry[header[j]] = values[j];
    }

    data.push(entry);
  }

  return data;
}

function getCumulativeTransactionsValue(accountId, transactionsData) {
  return transactionsData.reduce((total, transaction) => {
    if (parseInt(transaction.senderAccount) === accountId) {
      return total + parseInt(transaction.amount);
    }
    return total;
  }, 0);
}

export default function detectFraud(transactionsData) {
  const bankAccountsData = parseCSV(bankAccountsCSV);
  // const transactionsData = parseCSV(transactionsCSV);
  const eligibleAccounts = bankAccountsData.filter((account) => {
    const accountId = parseInt(account.accountNumber);
    const accountCreationDate = new Date(account.openingTime);

    console.log(account);

    const firstTransaction = transactionsData.find(
      (transaction) => parseInt(transaction.senderAccount) == accountId
    );

    console.log(firstTransaction);

    if (!firstTransaction) {
      return false; // Account has no transactions
    }

    const firstTransactionDate = new Date(firstTransaction.date);

    const thirtyOneDaysAfterCreation = new Date(accountCreationDate);
    thirtyOneDaysAfterCreation.setDate(accountCreationDate.getDate() + 31);

    // console.log(
    //   firstTransactionDate,
    //   thirtyOneDaysAfterCreation,
    //   accountCreationDate
    // );

    if (
      firstTransactionDate >= accountCreationDate &&
      firstTransactionDate < thirtyOneDaysAfterCreation
    ) {
      const last31Days = new Date(firstTransactionDate);
      last31Days.setDate(last31Days.getDate() + 31);

      const accountTransactions = transactionsData.filter(
        (transaction) =>
          parseInt(transaction.senderAccount) === accountId &&
          new Date(transaction.date) >= firstTransactionDate &&
          new Date(transaction.date) < last31Days
      );

      const cumulativeTransactionsValue = getCumulativeTransactionsValue(
        accountId,
        accountTransactions
      );

      // console.log("HEELO", cumulativeTransactionsValue);

      return cumulativeTransactionsValue > 5;
    }

    return false;
  });

  return eligibleAccounts;
}
