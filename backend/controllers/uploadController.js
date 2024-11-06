import Files from "../models/uploadFile";
import { processImages } from "../services/ocr";
import path from "path";
import request from "request";
import csvParser from "csv-parser";
import Transaction from "../models/transactions";
import Account from "../models/accountHolder";
import LooseTransaction from "../models/looseTransactions";
import { v4 as uuidv4 } from "uuid";
import { encrypt } from "../services/encrypt";
import backendURL from "../constants/backendURL";
import { b } from "../js_baml_client/async_client";
import { Image } from "@boundaryml/baml";

var fs = require("fs");

const uploadOperation = {
  fileToTransactions: (tempFile, userAccount, columnNames) => {
    if (!tempFile.fileType.includes("csv")) return;
    let f = fs.createReadStream(
      path.resolve(__dirname, `../public/uploads/${tempFile.name}`)
    );

    f.pipe(csvParser()).on("data", async (row) => {
      if (
        !row[columnNames.senderAccount] ||
        !row[columnNames.receiverAccount] ||
        !row[columnNames.date] ||
        !row[columnNames.amount] ||
        !row[columnNames.senderName] ||
        !row[columnNames.receiverName]
      ) {
        LooseTransaction.create({
          ...row,
          amount: parseFloat(row.amount),
          createdBy: userAccount._id,
        });
      } else {
        console.log({
          senderAccount: encrypt(row[columnNames.senderAccount]),
          receiverAccount: encrypt(row[columnNames.receiverAccount]),
          date: row[columnNames.date],
          senderName: encrypt(row[columnNames.senderName]),
          receiverName: encrypt(row[columnNames.receiverName]),
          id: uuidv4().toString(),
          amount: parseFloat(row[columnNames.amount]),
          createdBy: userAccount._id,
        });
        Transaction.create({
          senderAccount: encrypt(row[columnNames.senderAccount]),
          receiverAccount: encrypt(row[columnNames.receiverAccount]),
          date: row[columnNames.date],
          senderName: encrypt(row[columnNames.senderName]),
          receiverName: encrypt(row[columnNames.receiverName]),
          id: uuidv4().toString(),
          amount: parseFloat(row[columnNames.amount]),
          createdBy: userAccount._id,
        });
        try {
          if (
            !(await Account.findOne({
              accountNumber: row[columnNames.senderAccount],
            }))
          ) {
            await Account.create({
              accountNumber: row[columnNames.senderAccount],
              name: row[columnNames.senderName],
              createdBy: userAccount._id,
            });
          }
          if (
            !(await Account.findOne({
              accountNumber: row[columnNames.receiverAccount],
            }))
          ) {
            await Account.create({
              accountNumber: row[columnNames.receiverAccount],
              name: row[columnNames.receiverName],
              createdBy: userAccount._id,
            });
          }
        } catch (error) {
          console.log("Tried to create duplicate account" + error.message);
        }
      }
    });
  },
  // nodeOcr: (uploadedFiles, userAccount) => {
  //   processImages(
  //     uploadedFiles.map((file) =>
  //       path.resolve(__dirname, `../public/uploads/${file.name}`)
  //     ),
  //     path.resolve(
  //       __dirname,
  //       `../public/data/${uploadedFiles.map((file) => file.name).join("_")}.csv`
  //     ),
  //     async (outputCSVPath) => {
  //       await Files.create({
  //         name: outputCSVPath.split("/").pop(),
  //         fileType: outputCSVPath.split(".").pop(),
  //         userId: userAccount._id,
  //         allowedAdmins: userAccount.createdBy ? [userAccount.createdBy] : [],
  //         isGeneratedData: true,
  //       });
  //     }
  //   );
  // },

  apiExternalOcr: (tempFile, userAccount) => {
    if (!tempFile.fileType.includes("image/")) return;

    // Nanonets OCR for images files

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
      // console.log(body);
      const data = JSON.parse(body);
      const result0 = data.result[0].prediction.find((x) => x.label == "table");
      const result1 = result0.cells;

      const finalResult = [];

      for (var i = 0; i < result1.length; i += 6) {
        let obj;
        const inputString = result1[i + 2].text;
        const regex = /\b\d{12,}\b/g;
        const matches = inputString.match(regex);
        const numbersArray = matches ? matches.map(Number) : [];

        if (numbersArray.length === 0) {
          numbersArray.push(Math.floor(Math.random() * 10e12));
          numbersArray.push(Math.floor(Math.random() * 10e12));
        } else if (numbersArray.length === 1) {
          numbersArray.push(Math.floor(Math.random() * 10e12));
        }

        let namesArray = [
          "DHAIR",
          "ADITYA",
          "SUHAS",
          "KESHA",
          "SUBHA",
          "GROFE",
        ];
        let holderName = "";

        namesArray.forEach((name) => {
          let indexOfName = result1[i + 2].text.includes(name);
          if (indexOfName !== -1) {
            holderName = name;
            namesArray.splice(indexOfName, 1);
          }
        });

        if (result1[i + 3].text === "") {
          obj = {
            id: i / 6 + 1,
            date: result1[i].text,
            senderAccount: encrypt(numbersArray[0].toString()),
            senderName: encrypt(holderName),
            receiverAccount: encrypt(numbersArray[1].toString()),
            receiverName: encrypt(
              namesArray[Math.floor(Math.random() * namesArray.length)]
            ),
            amount: parseFloat(result1[i + 4].text),
          };
        } else {
          obj = {
            id: i / 6 + 1,
            date: result1[i].text,
            senderAccount: encrypt(numbersArray[1].toString()),
            senderName: encrypt(
              namesArray[Math.floor(Math.random() * namesArray.length)]
            ),
            receiverAccount: encrypt(numbersArray[0].toString()),
            receiverName: encrypt(holderName),
            amount: parseFloat(result1[i + 3].text),
          };
        }
        finalResult.push(obj);
        Transaction.create(obj);
        // console.log(finalResult);
      }

      // finalResult is the array of objects for creating table
    });
  },

  apiOcr: (tempFile, userAccount) => {
    if (!tempFile.fileType.includes("pdf")) return;
    const form_data = {
      file: fs.createReadStream(
        path.resolve(__dirname, `../public/uploads/${tempFile.name}`)
      ),
    };
    // const options = {
    //   url: "https://app.nanonets.com/api/v2/OCR/Model/0a5eae18-413d-401a-81ba-52a6c67ccdd3/LabelFile/?async=false",
    //   formData: form_data,
    //   headers: {
    //     Authorization:
    //       "Basic " +
    //       Buffer.from("bc8ac87f-2207-11ee-b063-7ad52bebbcde" + ":").toString(
    //         "base64"
    //       ),
    //   },
    // };

    // request.post(options, function (err, httpResponse, body) {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   // console.log(body);
    //   const data = JSON.parse(body);
    //   const result0 = data.result[0].prediction.find((x) => x.label == "table");
    //   const result1 = result0.cells;

    //   const finalResult = [];

    //   for (var i = 0; i < result1.length; i += 6) {
    //     let obj;
    //     const inputString = result1[i + 2].text;
    //     const regex = /\b\d{12,}\b/g;
    //     const matches = inputString.match(regex);
    //     const numbersArray = matches ? matches.map(Number) : [];
    //     console.log(numbersArray);

    //     if (numbersArray.length === 0) {
    //       numbersArray.push(Math.floor(Math.random() * 10e12));
    //       numbersArray.push(Math.floor(Math.random() * 10e12));
    //     } else if (numbersArray.length === 1) {
    //       numbersArray.push(Math.floor(Math.random() * 10e12));
    //     }

    //     let namesArray = [
    //       "DHAIR",
    //       "ADITYA",
    //       "SUHAS",
    //       "KESHA",
    //       "SUBHA",
    //       "GROFE",
    //     ];
    //     let holderName = "";

    //     namesArray.forEach((name) => {
    //       let indexOfName = result1[i + 2].text.includes(name);
    //       if (indexOfName !== -1) {
    //         holderName = name;
    //         namesArray.splice(indexOfName, 1);
    //       }
    //     });

    //     if (result1[i + 3].text === "") {
    //       obj = {
    //         id: i / 6 + 1,
    //         date: result1[i].text,
    //         senderAccount: numbersArray[0].toString(),
    //         senderName: holderName,
    //         receiverAccount: numbersArray[1].toString(),
    //         receiverName:
    //           namesArray[Math.floor(Math.random() * namesArray.length)],
    //         amount: result1[i + 4].text,
    //       };
    //     } else {
    //       obj = {
    //         id: i / 6 + 1,
    //         date: result1[i].text,
    //         senderAccount: numbersArray[1].toString(),
    //         senderName:
    //           namesArray[Math.floor(Math.random() * namesArray.length)],
    //         receiverAccount: numbersArray[0].toString(),
    //         receiverName: holderName,
    //         amount: result1[i + 3].text,
    //       };
    //     }
    //     finalResult.push(obj);
    //     Transaction.create(obj);
    //     // console.log(finalResult);
    //   }

    //   // finalResult is the array of objects for creating table
    // });

    let options = {
      url: `${backendURL}getPdfData`,
      headers: {
        "Content-Type": "application/json",
      },
      formData: form_data,
    };

    request.post(options, function (err, httpResponse, body) {
      console.log(httpResponse.statusCode);
      if (httpResponse.statusCode == 500)
        return res.status(500).json({
          message: "Error",
        });
      body = JSON.parse(body);
      let transactions = [];
      for (let i = 0; i < body.length; ++i) {
        transactions.push({
          amount: body[i].amount,
          date: body[i].date,
          receiverAccount: body[i].receiverAccount,
          receiverName: body[i].receiverName,
          senderAccount: body[i].senderAccount,
          senderName: body[i].senderName,
          id: uuidv4(),
          createdBy: userAccount._id,
        });

        Transaction.create({
          amount: body[i].amount,
          date: body[i].date,
          receiverAccount: encrypt(body[i].receiverAccount),
          receiverName: encrypt(body[i].receiverName),
          senderAccount: encrypt(body[i].senderAccount),
          senderName: encrypt(body[i].senderName),
          id: uuidv4().toString(),
          createdBy: userAccount._id,
        });
      }
    });
  },

  async operation(req, res) {
    const { files, userAccount, query, body } = req;
    const columnNames = JSON.parse(body.columnNames);
    const { useExternalApi } = body;
    console.log(typeof files)

    try {
      console.log("check");
      const img = Image.fromUrl(
        "https://i.ibb.co/wyB8F46/SBI-Bank-Statement-1691580368016-314327775.jpg"
      );

      const response = await b.ExtractDoc([img]);
      console.log(response);
      return res.status(200).send({
        hello: "it works",
        output: response,
      });

      if (!files)
        return res.status(500).send({
          status: 500,
          code: 0,
          data: null,
          message: null,
          error: "Unable to upload file",
        });
      const uploadedFiles = [];
      for (let file of files) {
        const tempFile = await Files.create({
          name: file.filename,
          fileType: file.mimetype,
          userId: userAccount._id,
          allowedAdmins: userAccount.createdBy ? [userAccount.createdBy] : [],
          fileCategory: body.fileType,
        });
        uploadedFiles.push(tempFile);
        uploadOperation.fileToTransactions(tempFile, userAccount, columnNames);
        if (useExternalApi) {
          uploadOperation.apiExternalOcr(tempFile, userAccount);
        }
        // else {
        // uploadOperation.apiOcr(tempFile, userAccount);

        if (!tempFile.fileType.includes("pdf"))
          return res.status(200).json({
            message: "File Uploaded Successfully",
            error: null,
          });
        const form_data = {
          file: fs.createReadStream(
            path.resolve(__dirname, `../public/uploads/${tempFile.name}`)
          ),
        };
        let options = {
          url: `${backendURL}getPdfData`,
          headers: {
            "Content-Type": "application/json",
          },
          formData: form_data,
        };

        request.post(options, function (err, httpResponse, body) {
          console.log(httpResponse.statusCode);
          console.log(body);
          if (httpResponse.statusCode == 500)
            return res.status(500).json({
              message: "Unable to post request on flask api",
              error: err,
            });
          body = JSON.parse(body);
          let transactions = [];
          for (let i = 0; i < body.length; ++i) {
            transactions.push({
              amount: body[i].amount,
              date: body[i].date,
              receiverAccount: body[i].receiverAccount,
              receiverName: body[i].receiverName,
              senderAccount: body[i].senderAccount,
              senderName: body[i].senderName,
              id: uuidv4(),
              createdBy: userAccount._id,
            });

            Transaction.create({
              amount: body[i].amount,
              date: body[i].date,
              receiverAccount: encrypt(body[i].receiverAccount),
              receiverName: encrypt(body[i].receiverName),
              senderAccount: encrypt(body[i].senderAccount),
              senderName: encrypt(body[i].senderName),
              id: uuidv4().toString(),
              createdBy: userAccount._id,
            });
          }
        });
        // }
      }
      // if (uploadedFiles.every(({ fileType }) => fileType.includes("image/"))) {
      //   // Tessaract OCR for images files
      //   uploadOperation.nodeOcr(uploadedFiles, userAccount);
      // }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: 400,
        code: 0,
        data: {},
        message: error.message,
        error,
      });
    }
  },
};

export default uploadOperation;
