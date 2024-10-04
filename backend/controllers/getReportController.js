import request from "request";
import Transaction from "../models/transactions";
import backendURL from "../constants/backendURL";

const getReports = {
	async operation(req, res) {
		try {
			const response = await Transaction.find({});
			console.log("hello")
			const options = {
				url: `${backendURL}allTransactionsReport`,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(response),
			};
			request.post(options, function (err, httpResponse, body) {
				if (err) console.log(err);
				return res.status(200).json({
					data: backendURL + JSON.parse(body)["link"],
					message: "report generated perfectly",
					error: null,
				});
			});
		} catch (error) {
			res.status(500).json({
				data: null,
				message: "Internal server error",
				error: error.message,
			});
		}
	},
};

export default getReports;
