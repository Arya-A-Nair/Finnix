import csvtojson from "csvtojson";
import request from "request";
import Files from "../models/uploadFile";
import path from "path";

const getMoneyFlowData = {
  async operation(req, res) {
    const { id, allTransactions } = req.query;

    try {
      const selectedFile = await Files.findOne({
        _id: id,
      });
      const fileUri = path.resolve(
        __dirname,
        `../public/${selectedFile.isGeneratedData ? "data" : "uploads"}/${
          selectedFile.name
        }`
      );
      let jsonData = await csvtojson().fromFile(fileUri);
      if (allTransactions) {
        res.status(200).json({
          transactions: jsonData,
          error: null,
        });
      }
      const options = {
        url: "https://frauddetection-xnph.onrender.com/fraudTransactions",
        body: JSON.stringify({
          transactions: jsonData.map((d) => ({
            sender: d.sender,
            receiver: d.receiver,
            date: d.date || "",
            amount: parseFloat(d.amount) || 0,
          })),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      request.post(options, function (err, _, body) {
        if (err)
          res.status(500).json({
            message: err.message + "Unable to post request on flask api",
            error: err,
          });
        const fraudtransactions = [];
        JSON.parse(body).map((t) => {
          const tran = jsonData.find((d) => {
            // console.log(
            //   d.amount,
            //   t[2].toString(),
            //   d.amount === t[2].toString()
            // );
            // TODO: Add amaount check
            return d.sender === t[0] && d.receiver === t[1];
          });
          if (tran) fraudtransactions.push(tran);
        });
        return res.status(200).json({
          transactions: fraudtransactions,
        });
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        error: error,
      });
    }
  },
};

export default getMoneyFlowData;
