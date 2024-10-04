let bank_names = [
	"Axis Bank",
	"Bandhan Bank",
	"CSB Bank",
	"City Union Bank",
	"DCB Bank",
	"Dhanlaxmi Bank",
	"Federal Bank",
	"HDFC Bank",
	"ICICI Bank",
	"IDBI Bank",
	"IDFC First Bank",
	"IndusInd Bank",
	"Jammu & Kashmir Bank",
	"Karnataka Bank",
	"Karur Vysya Bank",
	"Kotak Mahindra Bank",
	"Nainital Bank",
	"RBL Bank",
	"South Indian Bank",
	"Tamilnad Mercantile Bank",
	"Yes Bank",
];
const getBranchController = {
	async operation(req, res) {
		const { accountNumber } = req.query;
		let sum = 0;
        let number = parseInt(accountNumber);
		while (number > 0) {
			sum += number % 10;
			number = Math.floor(number / 10);
		}
		return res.status(200).json({
			status: 200,
			code: 1,
			data: bank_names[sum % bank_names.length],
			message: "createOperation response received",
			error: null,
		});
	},
};

export default getBranchController;
