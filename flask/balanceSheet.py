from sourceToSink import sourceToSink
import pandas as pd
from flask import Flask, jsonify, request
import json

def balanceSheet(transactions, balance, source):


    print(transactions)

    sorted_transactions = sorted(transactions, key=lambda x: x["date"])

    visited = set()
    leaves = set()
    lastTransaction = dict()
    values = dict()
  
    for i in reversed(sorted_transactions):
        if(i["receiverAccount"] not in visited):
            leaves.add(i["receiverAccount"])

        if(lastTransaction.get(i["senderAccount"], 0) == 0):
            lastTransaction[i["senderAccount"]] = i["date"]

        if(lastTransaction.get(i["receiverAccount"], 0) == 0):
            lastTransaction[i["receiverAccount"]] = i["date"]
        
        visited.add(i["receiverAccount"])
        visited.add(i["senderAccount"])

    for leaf in leaves:
        if(leaf == source): values[leaf] = 0
        else: values[leaf] = sourceToSink(source, leaf, transactions)

    balanceDict = dict()

    for i in balance:
        for j in leaves:
            date1 = lastTransaction.get(j, "0000-00-00")
            date2 = i['date']

            print(date1, date2, i['name'], j)

            if(date1 < date2):
                arr = balanceDict.get(i['_id'], [])
                if(values.get(j, 0)):
                  arr.append({'accountNumber' : j, 'amount': values.get(j, 0)})
                balanceDict[i['_id']] = arr

    arr=[]
    for i in balance:
        arr.append({"assetData": i, "sinks": balanceDict.get(i['_id'],[])})

    return arr



