import express from "express";
import errorHandler from "../middlewares/errorHandler";
import sanctionUser from "../middlewares/sanctionUser";
import {
  registerController,
  loginController,
  createController,
  uploadController,
  deleteController,
  inviteLinkController,
  allUsers,
  allFiles,
  createPasswordController,
  AllTransactions,
  getReports,
  getReportWithBaseAmountController,
  getAllAccounts,
  getTransactionsForAccount,
  getBalanceSheetAnalysis,
  balanceSheetController,
  getBranchController,
} from "../controllers";
import multer from "multer";
import cors from "cors";
import verifyCreatePasswordToken from "../middlewares/verifyCreatePasswordToken";
import addAccountController from "../controllers/auth/addAccountController";
import getMoneyFlowData from "../controllers/getMoneyFlowData";
import getAccountDetails from "../controllers/getAccountDetails";
import addSuspectedAccount from "../controllers/addSuspectedAccount";
import allSuspectedAccounts from "../controllers/allSuspectedAccounts";
import fraudAccountsController from "../controllers/fraudAccountsController";
import getFlowByTransactionController from "../controllers/getFlowByTransactionController";
import reportFraudController from "../controllers/reportFraudController";
import getCompalins from "../controllers/getComplainsController";
import updateComplaintStatus from "../controllers/updateComplaintStatusController";
import createNodes from "../controllers/createNodesController";

const router = express.Router();
router.use(cors());
router.use(errorHandler);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      file.originalname.split(`.${file.mimetype.split("/")[1]}`)[0] +
        "-" +
        uniqueSuffix +
        "." +
        file.mimetype.split("/")[1]
    );
  },
});

const storageForBalanceSheet = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/balanceSheets/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      file.originalname.split(`.${file.mimetype.split("/")[1]}`)[0] +
        "-" +
        uniqueSuffix +
        "." +
        file.mimetype.split("/")[1]
    );
  },
});

const upload = multer({ storage });
const uploadBalanceSheet = multer({ storage: storageForBalanceSheet });

router.post("/api/register", registerController.operation);
router.post("/api/addUser", sanctionUser, addAccountController.operation);
router.post("/api/login", loginController.operation);
router.post(
  "/api/createPassword",
  verifyCreatePasswordToken,
  createPasswordController.operation
);

router.post("/api/deleteUser", sanctionUser, deleteController.operation);
router.post("/api/createNodes", createNodes.operation);
router.get(
  "/api/getFlowByTransaction",
  sanctionUser,
  getFlowByTransactionController.operation
);

router.post("/api/create", sanctionUser, createController.operation);
router.post("/api/inviteLink", sanctionUser, inviteLinkController.operation);
router.post(
  "/api/upload",
  sanctionUser,
  upload.array("file"),
  uploadController.operation
);
router.post(
  "/api/uploadBalanceSheet",
  sanctionUser,
  uploadBalanceSheet.array("file"),
  balanceSheetController.operation
);

router.get("/api/transactions", AllTransactions.operation);
router.get("/api/allUsers", sanctionUser, allUsers.operation);
router.get("/api/allFiles", sanctionUser, allFiles.operation);
router.get("/api/getFlowData", sanctionUser, getMoneyFlowData.operation);
router.get("/api/getReport", sanctionUser, getReports.operation);
router.get(
  "/api/addSuspectedAccount",
  sanctionUser,
  addSuspectedAccount.operation
);
router.get(
  "/api/allSuspectedAccounts",
  sanctionUser,
  allSuspectedAccounts.operation
);
router.get("/api/getAllAccounts", sanctionUser, getAllAccounts.operation);
router.post(
  "/api/getReportWithBaseAmount",
  sanctionUser,
  getReportWithBaseAmountController.operation
);
router.post("/api/submitReport", reportFraudController.operation);
router.get("/api/getComplaints", sanctionUser, getCompalins.operation);
router.post(
  "/api/updateComplaint",
  sanctionUser,
  updateComplaintStatus.operation
);
router.get(
  "/api/trackSender",
  sanctionUser,
  getTransactionsForAccount.operation
);
router.get("/api/accountDetails", sanctionUser, getAccountDetails.operation);
router.get(
  "/api/fraudAccounts",
  sanctionUser,
  fraudAccountsController.operation
);
router.post(
  "/api/getBalanceSheetAnalysis",
  sanctionUser,
  getBalanceSheetAnalysis.operation
);
router.get("/api/getBranches", getBranchController.operation);

// Tests if user has valid and un-expired access token
router.get("/verifyAccessToken", sanctionUser, (req, res) => {
  res.status(200).json({
    status: 200,
    code: 1,
    data: {
      valid: true,
    },
    message: "Valid Access Token",
    error: null,
  });
});

export default router;
