import queue


def getGraphByTransactions(transactions, transaction):
    adj = dict()

    for tempTransaction in transactions:
        if tempTransaction["senderAccount"] != transaction["senderAccount"]:
            arr = adj.get(tempTransaction["senderAccount"], [])
            arr.append(tempTransaction)
            adj[tempTransaction["senderAccount"]] = arr

    edges = [transaction]
    visited = [transaction["senderAccount"]]

    q = queue.Queue()
    q.put(transaction["receiverAccount"])

    while not q.empty():
        front = q.get()

        if front in visited:
            continue
        else:
            visited.append(front)

        arr = adj.get(front, [])

        for trans in arr:
            if trans["date"] > transaction["date"]:
                edges.append(trans)
                q.put(trans["senderAccount"])

    return edges
