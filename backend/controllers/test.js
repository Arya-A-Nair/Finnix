  apiExternalOcr: (tempFile, userAccount) => {
    if (!tempFile.fileType.includes("image")) return;
    // Nanonets OCR for image files
    const form_data = {
      file: fs.createReadStream(
        path.resolve(__dirname, `../public/uploads/${tempFile.name}`)
      ),
    };

    const options = {
      url: "https://app.nanonets.com/api/v2/OCR/Model/0a5eae18-413d-401a-81ba-52a6c67ccdd3/LabelFile/?async=false",
      formData: form_data,
      headers: {
        Authorization:
          "Basic " +
          Buffer.from("bc8ac87f-2207-11ee-b063-7ad52bebbcde" + ":").toString(
            "base64"
          ),
      },
    };

    request.post(options, function (err, httpResponse, body) {
      if (err) {
        console.log(err);
        return;
      }
      //  console.log(body);
      const data = JSON.parse(body);
      const result0 = data.result[0].prediction.find((x) => x.label == "table");
      const result1 = result0.cells;


        let rawSenderNameObject = data.result[0].prediction.find((oneObject) => oneObject.label === "Account_name");
        // Final senderName
        let senderName = rawSenderNameObject.ocr_text; 

        let rawSenderAccountNumberObject = data.result[0].prediction.find((oneObject) => oneObject.label === "Account_number")
        // Final senderAccount
        let senderAccount = rawSenderAccountNumberObject.ocr_text;

        let rawAllTransactionDate = result1.filter((oneObject) => {
          return oneObject.label.includes("Transaction_date")
        });
        // Final Transactionn Date
        let allTransactionDate = [];
        rawAllTransactionDate.forEach((oneDateObject) => {
            allTransactionDate.push(oneDateObject.text);
        })
        console.log("lulu", senderAccount, senderName, allTransactionDate);

        let rawAllReceiverAccounts = result1.filter((oneObject) => {
          return oneObject.label.includes("Description");
        });
         // Final Transactionn Date
        let allReceiverAccounts = [];
        rawAllReceiverAccounts.forEach((oneReceiverAccountObject) => {
            allTransactionDate.push(oneReceiverAccountObject.text);
        })

        let receiverName = "";

        let rawDebitObject = result1.filter(
          (oneObject) => oneObject.label === "Debit"
        );
        let debit = [];
        rawDebitObject.forEach((oneDebitObject) => {
            debit.push(oneDebitObject.text);
        });

        let rawCreditObject = result1.filter(
          (oneObject) => oneObject.label === "Credit"
        );
        let credit = [];
        rawCreditObject.forEach((oneCreditObject) => {
          credit.push(oneCreditObject.text);
        })

        console.log("lulu", senderAccount, senderName, allTransactionDate, allReceiverAccounts, debit, credit);

        for (let i=0; i<allReceiverAccounts.length; ++i) {
            let obj;
            if (debit[i]!=="") {
            obj = {
                senderAccount,
                senderName,
                id: uuidv4().toString(),
                date: allTransactionDate[i],
                receiverName: "Not Defined",
                receiverAccount: allReceiverAccounts[i],
                amount: debit[i]
            }
        }
            else {
                obj = {
                    senderAccount: allReceiverAccounts[i],
                    senderName: "Not Defined",
                    id: uuidv4().toString(),
                    date: allTransactionDate[i],
                    receiverName: senderName,
                    receiverAccount: senderAccount,
                    amount: credit[i]
                }
            }
            Transaction.create({...obj});

            // console.log("XOXO",obj);
        }
    });
}