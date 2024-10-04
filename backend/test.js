import csvtojson from "csvtojson";
import request from "request";
let jsonData = await csvtojson().fromFile(
  "./public/data/1-1690943145140-923061512.png_2-1690943145144-233971083.png_3-1690943145147-109079695.png.csv"
);
console.log(jsonData.slice(0, 5));
jsonData = jsonData.map((d) => ({
  sender: d.sender,
  receiver: d.receiver,
  date: d.date || "",
  amount: parseFloat(d.amount) || 0,
}));

const options = {
  url: "https://frauddetection-xnph.onrender.com/fraudTransactions",
  body: JSON.stringify({ transactions: jsonData }),
  headers: {
    "Content-Type": "application/json",
  },
};

request.post(options, function (err, httpResponse, body) {
  console.log("entered");
  if (err) console.log(err);
  console.log(httpResponse.statusCode);
  console.log(body);
});
