import Files from "../models/uploadFile";
import path from "path";
import request from "request";
import csvParser from "csv-parser";
import Asset from "../models/assets";

var fs = require("fs");

const uploadBalanceSheetOperation = {
  processBalanceSheet: (tempFile, userAccount, accountNumber) => {
    if (!tempFile.fileType.includes("csv"))
      return res.status(400).send({
        data: null,
        error: "Invalid file type",
        message: "Invalid file type ",
      });
    let f = fs.createReadStream(
      path.resolve(__dirname, `../public/balanceSheets/${tempFile.name}`)
    );
    f.pipe(csvParser()).on("data", async (row) => {
      Asset.create({
        ...row,
        accountNumber: accountNumber,
        createdBy: userAccount._id,
      });
    });
  },

  async operation(req, res) {
    const { files, userAccount, body } = req;
    try {
      if (!files)
        return res.status(500).send({
          status: 500,
          code: 0,
          data: null,
          message: null,
          error: "Unable to upload balance sheet",
        });
      const uploadedFiles = [];
      const tempFile = await Files.create({
        name: files[0].filename,
        fileType: files[0].mimetype,
        userId: userAccount._id,
        allowedAdmins: userAccount.createdBy ? [userAccount.createdBy] : [],
        fileCategory: body.fileType,
      });
      uploadedFiles.push(tempFile);
      uploadBalanceSheetOperation.processBalanceSheet(
        tempFile,
        userAccount,
        body.accountNumber
      );

      res.status(200).json({
        status: 200,
        file: uploadedFiles,
        message: "Files uploaded successfully",
        error: null,
      });
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

export default uploadBalanceSheetOperation;
