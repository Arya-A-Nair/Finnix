const bankAccountsCSV = `
id,name,openingTime
1,idli,1999-12-12
2,baliga,2000-01-01
3,arya,1998-01-12
`;

const transactionsCSV = `
,id,date,senderAccount,receiverAccount,amount,senderName,receiverName
0,1,2000-01-01,1,2,100,Gaurish,Arya
1,2,2000-01-02,1,3,100,Gaurish,Pargat
2,3,2000-01-03,2,4,100,Arya,Vinay
3,4,2000-01-04,2,5,100,Arya,Vatsal
4,5,2000-01-05,3,6,100,Pargat,Hussain
5,6,2000-01-06,3,7,100,Pargat,Harshal
6,7,2000-01-07,4,8,100,Vinay,Soham
7,8,2000-01-08,4,9,100,Vinay,Jiya
8,9,2000-01-09,5,10,100,Vatsal,Tanvi
9,10,2000-01-10,5,11,100,Vatsal,Aditya
10,11,2000-01-11,6,12,100,Hussain,Kashvi
11,12,2000-01-12,7,12,100,Harshal,Kashvi
12,13,2000-01-13,8,13,100,Soham,Dhruv
13,14,2000-01-14,9,13,100,Jiya,Dhruv
14,15,2000-01-15,10,14,100,Tanvi,Rahli
15,16,2000-01-16,11,14,100,Aditya,Rahil
16,17,2000-01-17,12,15,100,Kashvi,Apurva
17,18,2000-01-18,13,15,100,Dhruv,Apurva
18,19,2000-01-19,14,16,100,Rahil,Diya
19,20,2000-01-20,15,16,100,Apurva,Diya
`;

function parseCSV(csv: string): any[] {
	const lines = csv.trim().split("\n");
	const header = lines[0].split(",");
	const data = [];

	for (let i = 1; i < lines.length; i++) {
		const values = lines[i].split(",");
		const entry: any = {};

		for (let j = 0; j < header.length; j++) {
			entry[header[j]] = values[j];
		}

		data.push(entry);
	}

	return data;
}

const bankAccountsData = parseCSV(bankAccountsCSV);
const transactionsData = parseCSV(transactionsCSV);

console.log(JSON.stringify(bankAccountsData, null, 2));
console.log(JSON.stringify(transactionsData, null, 2));

function isOpenedWithinOneMonth(account) {
	const openingDate = new Date(account.openingTime);
	const currentDate = new Date();
	const oneMonthAgo = new Date(currentDate);
	oneMonthAgo.setMonth(currentDate.getMonth() - 1);
	return openingDate >= oneMonthAgo;
}
