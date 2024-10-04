from flask import Flask, jsonify, request
import pickle
import json
from flask_cors import CORS
from getGraphByTransaction import getGraphByTransactions
from fraudulantTransactions import detectFraudulentNetwork
from muleBridges import muleBridges
from fraudulentGroups import fraudulentGroups
from sourceToSink import sourceToSink
from balanceSheet import balanceSheet
from getScore import getScore
from generateGraph import generateGraph
import os
import pdfkit
import pdfkit as pdf
import uuid
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
import pdfcrowd
import pandas as pd
import requests
from bs4 import BeautifulSoup
import tabula
import pandas as pd
from tabula import read_pdf
import os
import re
import PyPDF2
import pandas as pd


model = pickle.load(open("model.pkl", "rb"))

app = Flask(__name__, static_url_path="/static/", static_folder="static/")
CORS(app)
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


def convert_html_to_pdf(input_file, output_file):
    try:
        username = "gaurishbaliga"
        api_key = "142c52292fd0fe3e12dfde13b12003ef"

        client = pdfcrowd.HtmlToPdfClient(username, api_key)

        if type(input_file) == str:
            pdf = client.convertString(input_file)
            with open(output_file, "wb") as pdf_file:
                pdf_file.write(pdf)
        else:
            with open(input_file, "r", encoding="utf-8") as html_file:
                pdf = client.convertString(html_file.read())
                with open(output_file, "wb") as pdf_file:
                    pdf_file.write(pdf)

        print(f"Conversion successful. PDF saved to '{output_file}'")
    except pdfcrowd.Error as why:
        print(f"Error converting HTML to PDF: {why}")


@app.route("/", methods=["POST"])
def home():
    data = request.get_json()
    X_test = []
    X_test += [
        data["step"],
        data["amount"],
        data["oldBalanceOrig"],
        data["newBalanceOrig"],
        data["oldBalanceDest"],
        data["newBalanceDest"],
    ]
    if data["type"] == "CASH_IN":
        X_test += [1, 0, 0, 0, 0]
    elif data["type"] == "CASH_OUT":
        X_test += [0, 1, 0, 0, 0]
    elif data["type"] == "DEBIT":
        X_test += [0, 0, 1, 0, 0]
    elif data["type"] == "PAYMENT":
        X_test += [0, 0, 0, 1, 0]
    elif data["type"] == "TRANSFER":
        X_test += [0, 0, 0, 0, 1]
    else:
        return jsonify({"message": "Invalid data"}), 422

    prediction = model.predict([X_test])
    print(prediction[0])

    return jsonify({"prediction": str(prediction[0])})


@app.route("/fraudTransactions", methods=["POST"])
def predict():
    data = request.get_json()
    return jsonify(detectFraudulentNetwork(data["transactions"]))


@app.route("/muleBridges", methods=["POST"])
def getMules():
    data = request.get_json()
    return jsonify(muleBridges(data["transactions"]))


@app.route("/fraudulentGroups", methods=["POST"])
def getFraudGroups():
    data = request.get_json()
    return jsonify(fraudulentGroups(data["transactions"]))


@app.route("/sourceToSink", methods=["POST"])
def getSourceToSink():
    data = request.get_json()
    return jsonify(sourceToSink(data["from"], data["to"], data["transactions"]))


@app.route("/reportGenerator1", methods=["POST"])
def getReportGenerator1():
    data = request.files["file"]
    df = pd.read_csv(data)
    return jsonify(df.to_json(orient="records"))


@app.route("/allTransactionsReport", methods=["POST"])
def getAllTransactions():
    data = request.get_json()
    df = pd.DataFrame(data)
    df = df[["date", "senderAccount", "receiverAccount", "id", "amount"]]
    df.to_html("f.html")
    generatedTable = open("f.html", "r")
    file1 = open("transactionReport-part1.html", "r")
    file2 = open("transactionReport-part2.html", "r")
    file1Content = file1.read()
    file2Content = file2.read()
    generatedTable = generatedTable.read()
    filePath = "static/report" + str(uuid.uuid1()) + ".pdf"
    finalContent = f"{file1Content} {generatedTable} {file2Content}"
    convert_html_to_pdf(finalContent, filePath)
    return jsonify({"link": filePath})


@app.route("/getAnalysisWithTransactions", methods=["POST"])
def getAnalysisWithTransactions():
    data = request.get_json()
    df = pd.DataFrame(data["transactions"])
    mules = muleBridges(data["transactions"])
    groups = fraudulentGroups(data["transactions"])
    network = detectFraudulentNetwork(data["transactions"])

    average_amount_by_origin = df.groupby("senderAccount")["amount"].mean()
    top_5_nameOrig_highest_avg_amount = average_amount_by_origin.nlargest(5)

    top_5_nameOrig_highest_avg_amount_arr = []
    for i in top_5_nameOrig_highest_avg_amount.keys():
        top_5_nameOrig_highest_avg_amount_arr.append(
            {"accountNumber": i, "amount": top_5_nameOrig_highest_avg_amount[i]}
        )

    average_amount_by_origin_dest = df.groupby(["senderAccount", "receiverAccount"])[
        "amount"
    ].mean()
    top_5_nameOrig_dest_highest_avg_amount = average_amount_by_origin_dest.nlargest(5)
    top_5_nameOrig_dest_highest_avg_amount = (
        top_5_nameOrig_dest_highest_avg_amount.to_frame(name="average").reset_index()
    )
    users_with_highest_frequency = df["senderAccount"].value_counts()

    group_arr = []
    totalGroupAccountNumbers = set()
    for i in groups.keys():
        accountNumbers = groups[i]
        filtered_df = df[
            df["senderAccount"].isin(accountNumbers)
            | df["receiverAccount"].isin(accountNumbers)
        ]
        totalGroupAccountNumbers = totalGroupAccountNumbers.union(
            set(filtered_df["senderAccount"]).union(set(filtered_df["receiverAccount"]))
        )
        group_arr.append(
            {
                "groupNo": i,
                "accountNumbers": groups[i],
                "transaction": json.loads(filtered_df.to_json(orient="records")),
                "totalAmount": filtered_df["amount"].sum(),
            }
        )

    totalAccounts = set(df["senderAccount"]).union(set(df["receiverAccount"]))

    return jsonify(
        {
            "muleBridges": mules,
            "muleLen": len(mules),
            "fraudulentGroups": group_arr,
            "fraudulentNetwork": network,
            "fradulentTransaction": network,
            "usersWithHighestAverage": top_5_nameOrig_highest_avg_amount_arr,
            "twoUsersWithMostAverageAmount": top_5_nameOrig_dest_highest_avg_amount.to_json(
                orient="records"
            ),
            "usersWithHighestFrequency": users_with_highest_frequency.head(5)
            .to_frame("count")
            .reset_index()
            .to_json(orient="records"),
            "totalAccounts": len(totalAccounts),
            "totalGroupAccounts": len(list(totalGroupAccountNumbers)),
        }
    )


@app.route("/reportWithBaseAmount", methods=["POST"])
def getReportWithBaseAmount():
    data = request.get_json()
    df = pd.DataFrame(data["transactions"])
    safeTransactions = df[df["amount"] < data["baseAmount"]]
    fradulentTransactions = df[df["amount"] >= data["baseAmount"]]
    mules = muleBridges(data["transactions"])
    groups = fraudulentGroups(data["transactions"])
    network = detectFraudulentNetwork(data["transactions"])
    average_amount_by_origin = df.groupby("senderAccount")["amount"].mean()
    top_5_nameOrig_highest_avg_amount = average_amount_by_origin.nlargest(5)

    top_5_nameOrig_highest_avg_amount_arr = []
    for i in top_5_nameOrig_highest_avg_amount.keys():
        top_5_nameOrig_highest_avg_amount_arr.append(
            {"accountNumber": i, "amount": top_5_nameOrig_highest_avg_amount[i]}
        )

    average_amount_by_origin_dest = df.groupby(["senderAccount", "receiverAccount"])[
        "amount"
    ].mean()
    top_5_nameOrig_dest_highest_avg_amount = average_amount_by_origin_dest.nlargest(5)
    top_5_nameOrig_dest_highest_avg_amount = (
        top_5_nameOrig_dest_highest_avg_amount.to_frame(name="average").reset_index()
    )
    users_with_highest_frequency = df["senderAccount"].value_counts()

    group_arr = []
    for i in groups.keys():
        accountNumbers = groups[i]
        print(accountNumbers)
        filtered_df = df[
            df["senderAccount"].isin(accountNumbers)
            | df["receiverAccount"].isin(accountNumbers)
        ]
        group_arr.append(
            {
                "groupNo": i,
                "accountNumbers": groups[i],
                "transaction": json.loads(filtered_df.to_json(orient="records")),
            }
        )

    return jsonify(
        {
            "safeTransactionNum": len(safeTransactions),
            "baseFradulentAmount": data["baseAmount"],
            "numberOfTransactions": len(df),
            "safeTransactions": safeTransactions.to_json(orient="records"),
            "fradulentTransaction": fradulentTransactions.to_json(orient="records"),
            "fradulentTransactionNum": len(fradulentTransactions),
            "totalAnalysisAmount": df["amount"].sum(),
            "amountInSuspicion": fradulentTransactions["amount"].sum(),
            "safeTransactionAmount": safeTransactions["amount"].sum(),
            "muleBridges": mules,
            "muleLen": len(mules),
            "fraudulentGroups": group_arr,
            "fraudulentNetwork": network,
            "usersWithHighestAverage": top_5_nameOrig_highest_avg_amount_arr,
            "twoUsersWithMostAverageAmount": top_5_nameOrig_dest_highest_avg_amount.to_json(
                orient="records"
            ),
            "usersWithHighestFrequency": users_with_highest_frequency.head(5)
            .to_frame("count")
            .reset_index()
            .to_json(orient="records"),
        }
    )


@app.route("/balanceSheet", methods=["POST"])
def getBalance():
    data = request.get_json()
    return jsonify(
        {
            "sinksOfAssets": balanceSheet(
                data["transactions"], data["balanceSheet"], data["source"]
            ),
            "AmountOfSinks": len(
                balanceSheet(data["transactions"], data["balanceSheet"], data["source"])
            ),
        }
    )


@app.route("/findAccountFraud", methods=["POST"])
def findAccount():
    request_Data = request.get_json()
    url = f"https://gujaratcybercrime.org/GetTicketData.php?fraudacno={request_Data['account']}&recaptcha_response=A&lang=eng"
    try:
        response = requests.get(url)
        response.raise_for_status()
        html_content = response.text
        if (
            html_content.find("This Account number is not available in our Record!")
            == -1
        ):
            soup = BeautifulSoup(html_content, "html.parser")
            tbody = soup.find("tbody", id="ap_here")
            rows = tbody.find_all("tr")
            frauds = []
            account_numbers = []
            bank_names = []
            for row in rows:
                cells = row.find_all("td")
                frauds.append(cells[0].text.strip())
                account_numbers.append(cells[1].text.strip())
                bank_names.append(cells[2].text.strip())
            data = {
                "Type of Fraud": frauds,
                "Bank Account Number": account_numbers,
                "Bank Name": bank_names,
            }
            df = pd.DataFrame(data)
            df = df[df["Bank Account Number"] == str(request_Data["account"])]
            return jsonify(
                {
                    "frauds": json.loads(df.to_json(orient="records")),
                    "score": getScore(
                        request_Data["transactions"], request_Data["account"]
                    ),
                }
            )
        else:
            return jsonify(
                {
                    "frauds": [],
                    "score": getScore(
                        request_Data["transactions"], request_Data["account"]
                    ),
                }
            )
    except requests.exceptions.RequestException as e:
        print("Error:", e)

    return jsonify({"hello": "hello"})


@app.route("/getScore", methods=["POST"])
def score():
    data = request.get_json()
    return getScore(data["transactions"], data["source"])


@app.route("/getGraphByTransaction", methods=["POST"])
def getGraphByTransaction():
    data = request.get_json()
    return jsonify(getGraphByTransactions(data["transactions"], data["transaction"]))


pattern = r"UPI/(\d+)/"


def getAccountNumber(val):
    match = re.search(pattern, str(val))
    return match.group(1)


def extract_account_number(text):
    account_number_pattern = r"\b\d{12}\b"

    matches = re.findall(account_number_pattern, text)

    if matches:
        return matches[0]
    else:
        return None


def extract_account_number_from_pdf(pdf_path):
    with open(pdf_path, "rb") as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        num_pages = len(pdf_reader.pages)

        for page_num in range(num_pages):
            page = pdf_reader.pages[page_num]
            text = page.extract_text()

            account_number = extract_account_number(text)
            if account_number:
                return account_number

    return None


@app.route("/getPdfData", methods=["POST"])
def getPdfData():
    try:
        file = request.files["file"]
        print(file)
        filename = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(filename)
        pdf_directory = filename
        df_list = tabula.read_pdf(
            pdf_directory,
            multiple_tables=True,
            pandas_options={"header": None},
            pages="all",
        )

        dates = []
        description = []
        amount = []
        type = []

        for i in range(len(df_list)):
            for j in range(len(df_list[i][0])):
                dates.append(df_list[i][0][j])
                description.append(df_list[i][1][j])
                amount.append(df_list[i][2][j])
                type.append(df_list[i][3][j])
        data = {
            "date": dates[1:],
            "description": description[1:],
            "amount": amount[1:],
            "type": type[1:],
        }
        df = pd.DataFrame(data)
        userAccountNumber = extract_account_number_from_pdf(pdf_directory)
        filtered_df = df[df["description"].str.contains(pattern)]
        filtered_df["account"] = df["description"].str.extract(pattern)
        filtered_df["senderAccount"] = None
        filtered_df["receiverAccount"] = None
        for index, row in filtered_df.iterrows():
            if row["type"] == "CR":
                filtered_df.at[index, "senderAccount"] = userAccountNumber
                filtered_df.at[index, "receiverAccount"] = row["account"]
            elif row["type"] == "DR":
                filtered_df.at[index, "senderAccount"] = row["account"]
                filtered_df.at[index, "receiverAccount"] = userAccountNumber
        filtered_df["senderName"] = "Unknown"
        filtered_df["receiverName"] = "Unknown"
        filtered_df = filtered_df[
            [
                "date",
                "senderAccount",
                "receiverAccount",
                "amount",
                "senderName",
                "receiverName",
            ]
        ]
        filtered_df["amount"] = pd.to_numeric(filtered_df["amount"])
        return jsonify(json.loads(filtered_df.to_json(orient="records")))
    except:
        return jsonify({"error": "Data could not be parsed into common format"}), 500


@app.route("/createNodes", methods=["POST"])
def getNodes():
    data = request.get_json()
    return jsonify(generateGraph(data["edges"], data["nodes"]))
    # return generat


if __name__ == "__main__":
    app.run(debug=True, port=4000)
