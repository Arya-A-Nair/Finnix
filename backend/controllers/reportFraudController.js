import Complain from "../models/complains";

const reportFraudController = {
  async operation(req, res) {
    try {
      const {
        firstName,
        lastName,
        bankName,
        bankBranch,
        accountNumber,
        aadharNumber,
        typeOfFraud,
        descriptionOfFraud,
      } = req.body;

      const response = await Complain.create({
        firstName,
        lastName,
        bankName,
        bankBranch,
        accountNumber,
        aadharNumber,
        typeOfFraud,
        descriptionOfFraud,
      });

      res.status(200).json({
        data: response,
        error: null,
        message: "Reported Successfully",
      });
    } catch (error) {
      res.status(200).json({
        data: null,
        error: "Server Error " + error.message,
      });
    }
  },
};

export default reportFraudController;
